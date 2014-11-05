;(function() {
  "use strict";

  var sendAction = function(command) {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        var is_enabled = window.sk_sites.checkEnabled(tab.url);
        var is_tab_enabled = window.sk_sites.checkTabEnabled(tab.id);
        if(is_enabled && is_tab_enabled) {
          chrome.tabs.sendMessage(tab.id, {"action": command});
          console.log("Sent: " + command + " To: " + tab.url);
        }
      });
    });
  };

  var setIcon = function(isDisabled, tabId) {
    var iconPath = isDisabled ? "icon48_disabled.png" : "icon48.png";
    chrome.browserAction.setIcon({
      path: chrome.runtime.getURL(iconPath),
      tabId: tabId
    });
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
      //window.sk_sites.setSiteTabIcons();
    }
    if(request.action === "get_sites") {
      console.log("Options page wants the sitelist.");
      response(window.sk_sites.sites);
    }
    if(request.action === "get_site_controller") {
      response(window.sk_sites.getController(request.url));
    }
    if(request.action === "inject_controller") {
      console.log("Inject: " + request.file + " into: " + sender.tab.id);
      chrome.tabs.executeScript(sender.tab.id, {file: request.file});
    }
    if(request.action === "set_icon") {
      if(request.tab_id) console.log("set_icon request from Sitelist.");
      var tab_id = request.tab_id || sender.tab.id;
      var is_disabled = !(window.sk_sites.checkEnabled(request.url) &&
                  window.sk_sites.checkTabEnabled(tab_id));
      console.log("Set icon - TabID: " + tab_id + " Disabled: " + is_disabled + " tabinfo: ", sender.tab);
      setIcon(is_disabled, tab_id);
    }
    if(request.action === "get_commands") response(window.coms);
    if(request.action == "command") sendAction(request.command);
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
