function load_settings(hotkey_obj) {
  chrome.storage.local.get(function(obj) {
    for(var p in obj) {
      if(p == "hotkey-play-pause") hotkey_obj.codes.play = obj[p];
      if(p == "hotkey-play-next") hotkey_obj.codes.next = obj[p];
      if(p == "hotkey-play-prev") hotkey_obj.codes.prev = obj[p];
      if(p == "hotkey-mute") hotkey_obj.codes.mute = obj[p];
      if(p == "hotkey-mk-enabled") hotkey_obj.mk_enabled = obj[p];
    }
  });
}

// Class for storing keycodes and helper functions
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
  this.load = function() {load_settings(this);};
};

var hotkey_actions = {"play-pause": true, "play-next": true, "play-prev": true, "mute": true};
var url_patterns = {grooveshark: "*://*.grooveshark.com/*"};
var hotkeys = new Keys();
hotkeys.load();
console.log(JSON.stringify(hotkeys));

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.action == "get_keys") {
    sendResponse(JSON.stringify(hotkeys));
  }
  if(request.action == "update_keys") {
    hotkeys.load();
    console.log("upkeys " + hotkeys);
    chrome.tabs.query({}, function(tabs) {
      for(var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, {action: "update_keys", data: JSON.stringify(hotkeys)});
      }
    });
  }
  else if(request.action in hotkey_actions) {
    chrome.tabs.query({url: url_patterns.grooveshark}, function(tabs) {
      if(tabs.length > 0) {
        console.log("BG request:" + request.action + " SEND TO: " + tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, request.action);
      }
    });
  }
});