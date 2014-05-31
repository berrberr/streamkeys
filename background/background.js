//***
//Returns a regex that matches where the string is in a url's (domain) name
//***
var URL_check = function(domain) {
  "use strict";
  return (new RegExp("^(http|https)*(:\/\/)*(.*\\.)*(" + domain + "|www." + domain +")+\\."));
};

//TODO: iterate over all tabs, check each tabs vs list of ignored sites.
var sitelist = function(val)
{
  return {
    "8tracks": {name: val, tabid: val, enabled: val},
    "bandcamp": {name: val, tabid: val, enabled: val},
    "deezer": {name: val, tabid: val, enabled: val},
    "grooveshark": {name: val, tabid: val, enabled: val},
    "hypem": {name: val, tabid: val, enabled: val},
    "iheart": {name: val, tabid: val, enabled: val},
    "mixcloud": {name: val, tabid: val, enabled: val},
    "myspace": {name: val, tabid: val, enabled: val},
    "pandora": {name: val, tabid: val, enabled: val},
    "rdio": {name: val, tabid: val, enabled: val},
    "seesu": {name: val, tabid: val, enabled: val},
    "spotify": {name: val, tabid: val, enabled: val},
    "soundcloud": {name: val, tabid: val, enabled: val},
    "slacker": {name: val, tabid: val, enabled: val},
    "stitcher": {name: val, tabid: val, enabled: val},
    "thesixtyone": {name: val, tabid: val, enabled: val},
    "play.google": {name: val, tabid: val, enabled: val},
    "vk": {name: val, tabid: val, enabled: val}
  };
};

var URL_cache = function()
{
  this.site = sitelist(null);
};

//***
//Set a site's tab id to null when it's tab is closed
//***
URL_cache.prototype.remove_by_id = function(id) {
  for(var name in this.site) {
    if(this.site[name] == id) this.site[name] = null;
  }
};

//***
//Returns a list of sites to find tabID's for
//***
URL_cache.prototype.get_sites_to_find = function () {
  var tabs_to_find = [];
  for(var name in this.site) {
    if(this.site[name] === null) {
      tabs_to_find.push({"name": name, "url_regex": URL_check(name)});
    }
  }
  return tabs_to_find;
};

//***
//When a tab is closed if it is in the cache then remove it from the cache
//***
chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {cache.remove_by_id(tabID);});

//***
//Searches tabs array for the first matching domain of site_name and sends the requested action to that tab
//***
function query_tabs(tabs, site_name, request_action) {
  if(tabs.length > 0) {
    console.log("BG request:" + request.action + " SEND TO: " + tabs[0].title);
    chrome.tabs.sendMessage(tabs[0].id, {action: request_action, site: site_name});
  }
}

//***
//Send an action request to the music player's tab
//**
function send(cache, action) {
  for(var name in cache.site) {
    if(sites_enabled[name] && cache.site[name] !== null) { //If the site we are sending to is enabled in the settings, and the tab we are sending to exists
      console.log("BG request:" + action + " SEND TO: " + cache.site[name]);
      chrome.tabs.sendMessage(cache.site[name], {"action": action, "site": name});
    }
  }
}

//***
//Load settings from chrome localstorage
//***
function load_settings() {
  chrome.storage.local.get(function(obj) {
    if(obj.hasOwnProperty("hotkey-sites")) {
      $.each(window.sites_enabled, function(key, value) {
        window.sites_enabled[key].enabled = obj["hotkey-sites"][key];
      });
    } else {
      //If we don't find our key in localstorage then assume options page has not
      //been opened and set all sites to enabled
      window.sites_enabled = sitelist(true);
    }
  });
}

//***
//Capture hotkeys and send their actions to tab(s) with music player running
//***
chrome.commands.onCommand.addListener(function(command) {
  chrome.runtime.sendMessage({"action": command});
  var tabs_to_find = cache.get_sites_to_find();
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      for(var j = 0; j < tabs_to_find.length; j++) {
        if(tabs_to_find[j].url_regex.test(tabs[i].url)){
          cache.site[tabs_to_find[j].name] = tabs[i].id;
          tabs_to_find.splice(j, 1);
        }
      }
      chrome.tabs.sendMessage(tab.id, {"action": action, "site": name});
    });
    // tabs_to_find.forEach(function(site) {
    //   if(site)
    // });
    console.log("URL CACHE: " + JSON.stringify(cache));
    send(cache, command);
  });
});

//***
//Sent from content scripts on creation
//TODO: Move array from options page to a call to background for site list. Why do I have two copies of the same list????? stupid.
//***
chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if(request.action === "update_keys") load_settings(sites_enabled);
  if(request.action === "get_sites") {
    console.log("GETSIUTES");
    response(window.sites_enabled);
  }
});

//***
//Open info page on install/update
//***
chrome.runtime.onInstalled.addListener(function (details) {
  if(details.reason == "install") {
    chrome.tabs.create({url: "http://www.streamkeys.com/help.html?installed=true"});
  } else if(details.reason == "update") {
    //TODO: add this back
    //chrome.tabs.create({url: "http://www.streamkeys.com/help.html?updated=true"});
  }
});

(function() {
  window.cache = new URL_cache();
  window.sites_enabled = sitelist(false);
  load_settings();
})();
