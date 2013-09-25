// Class for storing keycodes and helper functions
(function() {
  var Keys = function() {
    this.modifier = false;
    this.codes = {play: 81, prev: 65, next: 83, mute: 77, alt: 18, ctrl: 17, cmd: 91};
    this.mk_codes = {mk_play: 179, mk_prev: 177, mk_next: 176, mk_mute: 173};
    this.is_mk = function(k) {
      for(var key in this.mk_codes) {
        if(this.mk_codes[key] == k) return true;
      }
      return false;
    };
  };
  var hotkeys = new Keys();
  // var modifier = {down: false};
  // var hotkeys = {play: 81, prev: 65, next: 83, mute: 77, alt: 18, ctrl: 17, cmd: 91};
  // var mk_hotkeys = {mk_play: 179, mk_prev: 177, mk_next: 176, mk_mute: 173};

  function reset_modifier() {hotkeys.modifier = false;}

  document.documentElement.addEventListener("keydown", function(k) {
    console.log(k.keyCode);
    var modifier = k.altKey || k.ctrlKey;
    //if(k.keyCode == hotkeys.codes.alt || k.keyCode == hotkeys.codes.ctrl) hotkeys.modifier = true;
    //if(hotkeys.modifier || hotkeys.is_mk(k.keyCode)) {
      if((k.keyCode == hotkeys.codes.play && modifier) || k.keyCode == hotkeys.mk_codes.mk_play) {
        chrome.extension.sendMessage({action:"play-pause"});
        console.log("send play-pause");
        reset_modifier();
      }
      if((k.keyCode == hotkeys.codes.next && modifier) || k.keyCode == hotkeys.mk_codes.mk_next) {
        chrome.extension.sendMessage({action:"play-next"});
        console.log("send play-next");
        reset_modifier();
      }
      if((k.keyCode == hotkeys.codes.prev && modifier) || k.keyCode == hotkeys.mk_codes.mk_prev) {
        chrome.extension.sendMessage({action:"play-prev"});
        console.log("send play-prev");
        reset_modifier();
      }
      if((k.keyCode == hotkeys.codes.mute && modifier) || k.keyCode == hotkeys.mk_codes.mk_mute) {
        chrome.extension.sendMessage({action:"mute"});
        console.log("send mute");
        reset_modifier();
      }
    //}
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