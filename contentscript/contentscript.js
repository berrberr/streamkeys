(function() {
  // TODO: move Keys declaration to background page
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
  function echo_storage() {chrome.storage.local.get(function(obj){console.log("storage: " + JSON.stringify(obj));});};
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
    this.is_mk = function(k) {
      for(var key in this.mk_codes) {
        if(this.mk_codes[key] == k) return true;
      }
      return false;
    };
  };
  var hotkeys = new Keys();
  hotkeys.load();
  console.log(JSON.stringify(hotkeys));

  function reset_modifier() {hotkeys.modifier = false;}
  function is_key_action(action, k) {
    if(action in hotkeys.codes && k != null) {
      var obj = hotkeys.codes[action];
      return (obj.key == k.keyCode && 
              obj.modifier_alt == k.altKey && 
              obj.modifier_shift == k.shiftKey && 
              obj.modifier_ctrl == k.ctrlKey);
    } else {
      return false;
    }
    console.log(JSON.stringify(hotkeys.codes[action]));
  }

  document.documentElement.addEventListener("keydown", function(k) {
    console.log(k.keyCode);
    var modifier = k.altKey || k.ctrlKey;
    if(is_key_action("play", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_play) {
      chrome.extension.sendMessage({action:"play-pause"});
      console.log("send play-pause");
      reset_modifier();
    } 
    if(is_key_action("next", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_next) {
      chrome.extension.sendMessage({action:"play-next"});
      console.log("send play-next");
      reset_modifier();
    }
    if(is_key_action("prev", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_prev) {
      chrome.extension.sendMessage({action:"play-prev"});
      console.log("send play-prev");
      reset_modifier();
    }
    if(is_key_action("mute", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_mute) {
      chrome.extension.sendMessage({action:"mute"});
      console.log("send mute");
      reset_modifier();
    }
  });

  function click(elementId) {
    $(elementId)[0].click();
  }

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("message recv" + request);
    if(request == "play-pause") click("#play-pause");
    if(request == "play-next") click("#play-next");
    if(request == "play-prev") click("#play-prev");
    if(request == "mute") click("#volume");
  });
})();