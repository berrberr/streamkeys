//***
//Returns a regex that matches where the string is in a url's (domain) name
//***
var URL_check = function(domain) {
  "use strict";
  return (new RegExp("^(http|https)*(:\/\/)*(.*\\.)*(" + domain + "|www." + domain +")+\\.com"));
};

//Class for storing keycodes and helper functions
var Keys = function() {
  this.codes =
  {
    play: {key: 81, modifier_alt: true, modifier_ctrl: false, modifier_shift: false},
    prev: {key: 65, modifier_alt: true, modifier_ctrl: false, modifier_shift: false},
    next: {key: 83, modifier_alt: true, modifier_ctrl: false, modifier_shift: false},
    mute: {key: 77, modifier_alt: true, modifier_ctrl: false, modifier_shift: false}
  };
  this.mk_codes = {mk_play: 179, mk_prev: 177, mk_next: 176, mk_mute: 173};
  this.mk_enabled = true;
  this.sites =
  {
    "8tracks": true,
    "bandcamp": true,
    "deezer": true,
    "grooveshark": true,
    "hypem": true,
    "myspace": true,
    "pandora": true,
    "rdio": true,
    "spotify": true,
    "soundcloud": true
  };
};

//***
//Load setting from chrome extension storage into the Keys object
//***
Keys.prototype.Load = (function() {
  var _keys = this;
  chrome.storage.local.get(function(obj) {
    for(var p in obj) {
      if(p == "hotkey-play-pause") _keys.codes["play"] = obj[p];
      if(p == "hotkey-play-next") _keys.codes["next"] = obj[p];
      if(p == "hotkey-play-prev") _keys.codes["prev"] = obj[p];
      if(p == "hotkey-mute") _keys.codes["mute"] = obj[p];
      if(p == "hotkey-mk-on") _keys.mk_enabled = obj[p];
      if(p.slice(-7) == "enabled" && p.slice(0, 6) == "hotkey") {
        var name = p.substr(7, (p.length - 15));
        console.log("NAME: " + name);
        _keys.sites[name] = obj[p];
      }
    }
    console.log("HOTKEYS: " + JSON.stringify(hotkeys));
  });
});

var URL_cache = function()
{
  this.site = {
    "8tracks": null,
    "bandcamp": null,
    "deezer": null,
    "grooveshark": null,
    "hypem": null,
    "myspace": null,
    "pandora": null,
    "rdio": null,
    "spotify": null,
    "soundcloud": null
  };
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

var hotkey_actions = {"play_pause": true, "play_next": true, "play_prev": true, "mute": true};
var cache = new URL_cache();
var hotkeys = new Keys();
hotkeys.Load();

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
    if(hotkeys.sites[name] && cache.site[name] !== null) { //If the site we are sending to is enabled in the settings, and the tab we are sending to exists
      console.log("BG request:" + action + " SEND TO: " + cache.site[name]);
      chrome.tabs.sendMessage(cache.site[name], {"action": action, "site": name});
    }
  }
}

//***
//Capture hotkeys and send their actions to tab(s) with music player running
//***
chrome.commands.onCommand.addListener(function(command) {
  var tabs_to_find = cache.get_sites_to_find();
  chrome.tabs.query({}, function(tabs) {
    for(var i = 0; i < tabs.length; i++) {
      for(var j = 0; j < tabs_to_find.length; j++) {
        if(tabs_to_find[j].url_regex.test(tabs[i].url)){
          cache.site[tabs_to_find[j].name] = tabs[i].id;
          tabs_to_find.splice(j, 1);
        }
      }
    }
    console.log("URL CACHE: " + JSON.stringify(cache));
    send(cache, command);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.action == "get_keys") {
    sendResponse(JSON.stringify(hotkeys));
  }
  if(request.action == "update_keys") {
    this.hotkeys.Load();
    chrome.tabs.query({}, function(tabs) {
      for(var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, {action: "update_keys", data: JSON.stringify(hotkeys)});
      }
    });
  }
  //This is a request for a hotkey action
  // else if(request.action in hotkey_actions) {
  //   var tabs_to_find = cache.get_sites_to_find();
  //   var action = request.action;
  //   chrome.tabs.query({}, function(tabs) {
  //     for(var i = 0; i < tabs.length; i++) {
  //       for(var j = 0; j < tabs_to_find.length; j++) {
  //         if(tabs_to_find[j].URL_check().test(tabs[i].url)){
  //           cache.site[tabs_to_find[j]] = tabs[i].id;
  //           tabs_to_find.splice(j, 1);
  //         }
  //       }
  //     }
  //     console.log("URL CACHE: " + JSON.stringify(cache));
  //     send(cache, action);
  //   });
  // }
});