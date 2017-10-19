;(function() {
  "use strict";

  var Sitelist = require("./modules/Sitelist.js"),
      _ = require("lodash");

  /**
   * Needed for phantomjs to work
   * @see [https://github.com/ariya/phantomjs/issues/12401]
   */
  require("es6-promise").polyfill();

  /**
   * Tracks TimeoutIds by notification ID, to cancel previous uncomplete Timeouts
   * when a new notification is created prior to the last notification clearing
   */
  var notificationTimeouts = {};

  /**
   * Map from tab.id to it's status and time when it was updated
   * e.g. tabStates = {"787" : {"timestamp": <epoch>, "state": <state>}, ...}
   * Look ./modules/BaseController.js getStateData method for what is state.
   */
  var tabStates = {};

  /**
   * Send a player action to every active player tab if it's state command
   * or "stop"-like command. Otherwise command target depends on
   * "single player mode" option.
   * @param {String} command - name of the command to pass to the players
   */
  var sendAction = function(command) {
    var active_tabs = window.sk_sites.getActiveMusicTabs();
    active_tabs.then(function(tabs) {
      if (command === "mute" ||
          command === "stop" ||
          command === "playerStateNotify" ||
          command === "getPlayerState") {
        sendActionAllPlayers(command, tabs);
        return;
      }
      chrome.storage.sync.get(function(obj) {
        if (obj.hasOwnProperty("hotkey-single_player_mode") &&
            obj["hotkey-single_player_mode"]) {
          sendActionSinglePlayer(command, tabs);
        } else {
          sendActionAllPlayers(command, tabs);
        }
      });
    });
  };

  /**
   * For "single player mode": if any tabs are playing - sends
   * action to all (as it's not clear which one to prefer)
   * otherwise picks tab with most recently updated status.
   */
  var sendActionSinglePlayer = function(command, tabs) {
    if (_.isEmpty(tabs)) return;
    var playing = getPlayingTabs(tabs);
    if (_.isEmpty(playing)) {
      sendActionAllPlayers(command, [getRecentTab(tabs)]);
    } else {
      sendActionAllPlayers(command, playing);
    }
  };

  /**
   * Returns tab with most recently updated status.
   */
  var getRecentTab = function(tabs) {
    return _.max(tabs, function(tab) {
      if (tabStates.hasOwnProperty(tab.id)) {
        return tabStates[tab.id].timestamp;
      }
      return 0;
    });
  };

  /**
   * Filters out tabs that has not reported 'isPlaying' status.
   */
  var getPlayingTabs = function(tabs) {
    return _.filter(tabs, function(tab) {
      return tabStates.hasOwnProperty(tab.id) &&
        tabStates[tab.id].state.isPlaying;
    });
  };

  /**
   * Sends command to every tab in the list.
   */
  var sendActionAllPlayers = function(command, tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, { "action": command });
      console.log("Sent: " + command + " To: " + tab.url);
    });
  };

  /**
   * Process a command sent from somewhere (popup or content script) in the extension
   * @param {Object} request - Chrome request object from runtime.onMessage
   */
  var processCommand = function(request) {
    if(request.tab_target && parseInt(request.tab_target)) {
      chrome.tabs.sendMessage(parseInt(request.tab_target), { "action": request.command });
      console.log("Single tab request. Sent: " + request.command + " To: " + request.tab_target);
    } else {
      sendAction(request.command);
    }
  };

  /**
   * Capture hotkeys and send their actions to tab(s) with music player running
   */
  chrome.commands.onCommand.addListener(function(command) {
    sendAction(command);
  });

  /**
   * Messages sent from Options page
   */
  chrome.runtime.onMessage.addListener(function(request, sender, response) {
    if(request.action === "update_keys") {
      window.sk_sites.loadSettings();
    }
    if(request.action === "update_site_settings") {
      console.log("updating site settings: ", request.siteKey, request.siteState);
      window.sk_sites.setSiteState(request.siteKey, request.siteState).then(function() {
        response(true);
      });
    }
    if(request.action === "get_sites") {
      response(window.sk_sites.sites);
    }
    if(request.action === "get_site_controller") {
      response(window.sk_sites.getController(sender.tab.url));
    }
    if(request.action === "inject_controller") {
      console.log("Inject: " + request.file + " into: " + sender.tab.id);
      chrome.tabs.executeScript(sender.tab.id, {file: request.file});
    }
    if(request.action === "check_music_site") {
      /**
       * A tab index of -1 means that the tab is "embedded" in a page
       * We should only inject into actual tabs
       */
      if(sender.tab.index === -1) return response("no_inject");
      response(window.sk_sites.checkMusicSite(sender.tab.url));
    }
    if(request.action === "get_commands") response(window.coms);
    if(request.action === "command") processCommand(request);
    if(request.action === "update_player_state") {
      tabStates[sender.tab.id] = {
        "timestamp": Date.now(),
        "state": request.stateData
      };
      chrome.runtime.sendMessage({
        action: "update_popup_state",
        stateData: request.stateData,
        fromTab: sender.tab
      });
    }
    if(request.action === "get_music_tabs") {
      var musicTabs = window.sk_sites.getMusicTabs();
      musicTabs.then(function(tabs) {
        response(tabs);
      });

      return true;
    }
    if(request.action === "send_change_notification") {
      if (window.sk_sites.checkShowNotifications(sender.tab.url) &&
          window.sk_sites.checkTabEnabled(sender.tab.id)) {
        sendChangeNotification(request, sender);
      }
    }
  });

  var sendChangeNotification = function(request, sender) {
    chrome.notifications.create(sender.id + request.stateData.siteName, {
        type: "list",
        title: request.stateData.siteName,
        message: request.stateData.song || "",
        iconUrl: request.stateData.art || chrome.extension.getURL("icon128.png"),
        items: [
          { title: request.stateData.song, message: "" },
          { title: request.stateData.artist || "", message: request.stateData.album || "" }
        ]
      }, function(notificationId) {
        if(notificationTimeouts[notificationId])
        {
          clearTimeout(notificationTimeouts[notificationId]);
          delete notificationTimeouts[notificationId];
        }

        notificationTimeouts[notificationId] = setTimeout(function() {
          chrome.notifications.clear(notificationId);
        }, 5000);
      });
  };

  /**
   * Copy over old settings from local storageArea to sync.
   * @note This change introduced in v1.5.5. Deprecate this at some point in the future.
   */
  var storageInitializedCheck = new Promise(function(resolve) {
    chrome.storage.sync.get(function(syncStorageObj) {
      if(syncStorageObj["hotkey-initialized"]) {
        resolve();
      } else {
        var newStorageObj = {
          "hotkey-initialized": true
        };

        chrome.storage.local.get(function(localStorageObj) {
          _.each(localStorageObj, function(value, key) {
            newStorageObj[key] = value;
          });

          chrome.storage.sync.set(newStorageObj, function() {
            resolve();
          });
        });
      }
    });
  });

  storageInitializedCheck.then(function() {
    // Open info page on install/update
    chrome.runtime.onInstalled.addListener(function(details) {
      chrome.storage.sync.get(function(obj) {
        if(obj["hotkey-open_on_update"] || typeof obj["hotkey-open_on_update"] === "undefined") {
          if(details.reason == "install") {
            chrome.tabs.create({
              url: "http://www.streamkeys.com/guide.html?installed=true"
            });
          } else if(details.reason == "update") {
            // chrome.tabs.create({
            //   url: "http://www.streamkeys.com/guide.html?updated=true"
            // });
          }
        }
      });
    });

    // Store commands in global
    chrome.commands.getAll(function(cmds) {
      window.coms = cmds;
    });

    // Define sk_sites as a sitelist in global context
    window.sk_sites = new Sitelist();
    window.sk_sites.loadSettings();
  });
})();
