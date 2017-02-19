;(function() {
  "use strict";

  var Sitelist = require("./modules/Sitelist.js"),
      _ = require("lodash"),
      io = require("socket.io-client");

  /**
   * Needed for phantomjs to work
   * @see [https://github.com/ariya/phantomjs/issues/12401]
   */
  require("es6-promise").polyfill();

  /**
   * Send a player action to every active player tab
   * @param {String} command - name of the command to pass to the players
   */
  var sendAction = function(command) {
    var active_tabs = window.sk_sites.getActiveMusicTabs();
    active_tabs.then(function(tabs) {
      // Send the command to every music tab
      tabs.forEach(function(tab) {
        chrome.tabs.sendMessage(tab.id, { "action": command });
        console.log("Sent: " + command + " To: " + tab.url);
      });
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
   * Attempt to connect to a Unified Remote server
   * @param {String} port - Port number of server
   * @return {Promise}
   */
  var initializeUnifiedRemoteConnection = function(port) {
    var promise = new Promise(function(resolve) {
      var socket = io("http://localhost:" + port, { reconnection: false });

      socket.on("connect", function() {
        // Listen for SK commands from remote server
        socket.on("skCommand", function(data) {
          console.log("skCommand :: ", data.command);
          sendAction(data.command);
        });

        socket.on("disconnect", function() {
          // TODO: also setup reconnect function timeout on disconnect
          updateUnifiedRemoteConnectionState({ status: "disconnected" });
        });

        console.log("connected");
        resolve({ status: "connected" });
      });

      socket.on("connect_error", function() {
        console.log("connection error");
        resolve({ status: "connection_error" });
      });
    });

    return promise;
  };

  /**
   * Signal to user the connected state of unified remote. Updates:
   *   1. Message at bottom of popup player.
   *   2. Extension icon.
   */
  var updateUnifiedRemoteConnectionState = function(state) {
    console.log("Updating remote state: ", state);
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
    if(request.action === "unified_remote_connection") {
      initializeUnifiedRemoteConnection(request.port).then(function(status) {
        console.log("connection status: ", status);
        response(status);
        updateUnifiedRemoteConnectionState(status);
      });

      return true;
    }
  });

  /**
   * Copy over old settings from local storageArea to sync.
   * @note This change introduced in v1.5.5. Deprecate this at some point in the future.
   */
  var storageInitializedCheck = new Promise(function(resolve) {
    chrome.storage.sync.get(function(syncStorageObj) {
      if(syncStorageObj["hotkey-initialized"]) {
        resolve(syncStorageObj);
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

  storageInitializedCheck.then(function(storageObj) {
    // Open info page on install/update
    chrome.runtime.onInstalled.addListener(function(details) {
      if(storageObj["hotkey-open_on_update"] || typeof storageObj["hotkey-open_on_update"] === "undefined") {
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

    if (storageObj["hotkey-server_port"]) {
      initializeUnifiedRemoteConnection(storageObj["hotkey-server_port"]).then(function(status) {
        updateUnifiedRemoteConnectionState(status);
      });
    }

    // Store commands in global
    chrome.commands.getAll(function(cmds) {
      window.coms = cmds;
    });

    // Define sk_sites as a sitelist in global context
    window.sk_sites = new Sitelist();
    window.sk_sites.loadSettings();
  });
})();
