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
  this.mk_enabled = false;
  this.sites =
  {
    bandcamp: true,
    grooveshark: true,
    pandora: true,
    rdio: true,
    spotify: true
  };
  this.grooveshark_enabled = true;
  this.bandcamp_enabled = true;
  this.rdio_enabled = true;
  this.spotify_enabled = true;
  this.pandora_enabled = true;
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
      if(p == "hotkey-mk-enabled") _keys.mk_enabled = obj[p];
      if(p == "hotkey-grooveshark-enabled") _keys.grooveshark_enabled = obj[p];
      if(p == "hotkey-bandcamp-enabled") _keys.bandcamp_enabled = obj[p];
      if(p == "hotkey-rdio-enabled") _keys.rdio_enabled = obj[p];
      if(p == "hotkey-spotify-enabled") _keys.spotify_enabled = obj[p];
      if(p == "hotkey-pandora-enabled") _keys.pandora_enabled = obj[p];
    }
  });
});

var hotkey_actions = {"play-pause": true, "play-next": true, "play-prev": true, "mute": true};
var url_patterns = {grooveshark: "*://*.grooveshark.com/*", bandcamp: "*://*.bandcamp.com/*", rdio: "*://*.rdio.com/*", spotify: "*://*.spotify.com/*", pandora: "*://*.pandora.com/*"};
var hotkeys = new Keys();
hotkeys.Load();

//***
//Searches tabs array for the first matching domain of site_name and sends the requested action to that tab
//***
function query_tabs(tabs, site_name, request_action) {
  if(tabs.length > 0) {
    console.log("BG request:" + request.action + " SEND TO: " + tabs[0].title);
    chrome.tabs.sendMessage(tabs[0].id, {action: request_action, site: site_name});
  }
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.action == "get_keys") {
    sendResponse(JSON.stringify(hotkeys));
  }
  if(request.action == "update_keys") {
    hotkeys.load();
    chrome.tabs.query({}, function(tabs) {
      for(var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, {action: "update_keys", data: JSON.stringify(hotkeys)});
      }
    });
  }
  else if(request.action in hotkey_actions) {
    chrome.tabs.query({}, function(tabs) {
      for(var i = 0; i < tabs.length; i++) {
      }
    });

    if(hotkeys.grooveshark_enabled) {
      chrome.tabs.query({url: url_patterns.grooveshark}, function(tabs) {
        if(tabs.length > 0) {
          console.log("BG request:" + request.action + " SEND TO: " + tabs[0].title);
          chrome.tabs.sendMessage(tabs[0].id, {action: request.action, site: "grooveshark"});
        }
      });
    }
    if(hotkeys.bandcamp_enabled) {
      chrome.tabs.query({url: url_patterns.bandcamp}, function(tabs) {
        if(tabs.length > 0) {
          console.log("BG request:" + request.action + " SEND TO: " + tabs[0].title);
          chrome.tabs.sendMessage(tabs[0].id, {action: request.action, site: "bandcamp"});
        }
      });
    }
    if(hotkeys.rdio_enabled) {
      chrome.tabs.query({url: url_patterns.rdio}, function(tabs) {
        if(tabs.length > 0) {
          console.log("BG request:" + request.action + " SEND TO: " + tabs[0].title);
          chrome.tabs.sendMessage(tabs[0].id, {action: request.action, site: "rdio"});
        }
      });
    }
    if(hotkeys.spotify_enabled) {
      chrome.tabs.query({url: url_patterns.spotify}, function(tabs) {
        if(tabs.length > 0) {
          console.log("BG request:" + request.action + " SEND TO: " + tabs[0].title);
          chrome.tabs.sendMessage(tabs[0].id, {action: request.action, site: "spotify"});
        }
      });
    }
    if(hotkeys.pandora_enabled) {
      chrome.tabs.query({url: url_patterns.pandora}, function(tabs) {
        if(tabs.length > 0) {
          console.log("BG request:" + request.action + " SEND TO: " + tabs[0].title);
          chrome.tabs.sendMessage(tabs[0].id, {action: request.action, site: "pandora"});
        }
      });
    }
  }
});