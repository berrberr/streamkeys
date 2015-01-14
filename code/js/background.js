;(function() {
  "use strict";

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

  var setIcon = function(isDisabled, tabId) {
    var iconPath = isDisabled ? "icon38_disabled.png" : "icon38.png";
    chrome.browserAction.setIcon({
      path: chrome.runtime.getURL(iconPath),
      tabId: tabId
    });
  };

  /**
   * Process a command sent from somewhere (popup or content script) in the extension
   * @param request {Object} Chrome request object from runtime.onMessage
   */
  var processCommand = function(request) {
    if(request.tab_target && parseInt(request.tab_target)) {
      chrome.tabs.sendMessage(parseInt(request.tab_target), { "action": request.command });
      console.log("Single tab request. Sent: " + request.command + " To: " + request.tab_target);
    }
    else {
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
      console.log("Options page has updated settings. Reloading..." + request.site_id);
      window.sk_sites.loadSettings();
      // Get the site url based on the site_id key and pass that into setSiteTabIcons
      if(request.site_id)
        window.sk_sites.setSiteTabIcons(window.sk_sites.sites[request.site_id].url);
    }
    if(request.action === "get_sites") {
      console.log("Options page wants the sitelist.");
      response(window.sk_sites.sites);
    }
    if(request.action === "get_site_controller") {
      response(window.sk_sites.getController(sender.tab.url));
    }
    if(request.action === "inject_controller") {
      console.log("Inject: " + request.file + " into: " + sender.tab.id);
      chrome.tabs.executeScript(sender.tab.id, {file: request.file});
    }
    if(request.action === "set_icon") {
      var tab_id = request.tab_id || sender.tab.id,
          url = request.url || sender.tab.url;
      var is_disabled = !(window.sk_sites.checkEnabled(url) &&
                  window.sk_sites.checkTabEnabled(tab_id));
      console.log("Set icon - TabID: " + tab_id + " -- Disabled: " +
        is_disabled + " -- Tabinfo: ", sender.tab);
      setIcon(is_disabled, tab_id);
    }
    if(request.action === "check_music_site") {
      // A tab index of -1 means that the tab is "embedded" in a page
      // We should only inject into actual tabs
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
    if(request.action === "get_active_tabs") {
      var active_tabs = window.sk_sites.getActiveMusicTabs();
      active_tabs.then(function(tabs) {
        console.log("Active tabs: ", tabs);
        response(tabs);
      });

      return true;
    }
  });

  /**
   * Open info page on install/update
   */
  chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
      // Only open the site if not already on it
      // streamkeys-install session var will be created on click of install button on streamkeys site
      // TODO: figure out how to make this work
      // var fromSite = sessionStorage.getItem("streamkeys-install");
      // if(fromSite === null)
      //chrome.tabs.create({url: "http://www.streamkeys.com/guide.html?installed=true"});
    } else if(details.reason == "update") {
      //chrome.tabs.create({url: "http://www.streamkeys.com/guide.html?updated=true"});
    }
  });

  // Store commands in global
  chrome.commands.getAll(function(cmds) {
    window.coms = cmds;
  });

  // Define sk_sites as a sitelist in global context
  window.sk_sites = require("./modules/Sitelist.js");
  window.sk_sites.loadSettings();
})();
