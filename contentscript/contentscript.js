(function() {
  chrome.extension.sendMessage({action: "get_keys"}, function(resp) {
    var hotkeys = JSON.parse(resp);
    function is_key_action(action, k) {
      if(action in hotkeys.codes && k !== null) {
        var obj = hotkeys.codes[action];
        return (obj.key == k.keyCode &&
                obj.modifier_alt == k.altKey &&
                obj.modifier_shift == k.shiftKey &&
                obj.modifier_ctrl == k.ctrlKey);
      } else {
        return false;
      }
    }

    document.documentElement.addEventListener("keydown", function(k) {
      console.log(k.keyCode);
      var modifier = k.altKey || k.ctrlKey;
      if(is_key_action("play", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_play) {
        chrome.extension.sendMessage({action:"play-pause"});
        console.log("send play-pause");
      }
      if(is_key_action("next", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_next) {
        chrome.extension.sendMessage({action:"play-next"});
        console.log("send play-next");
      }
      if(is_key_action("prev", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_prev) {
        chrome.extension.sendMessage({action:"play-prev"});
        console.log("send play-prev");
      }
      if(is_key_action("mute", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_mute) {
        chrome.extension.sendMessage({action:"mute"});
        console.log("send mute");
      }
    });

    function click(elementId) {
      $(elementId)[0].click();
    }

    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
      console.log("message recv" + request);
      if(request.action == "update_keys") {
        hotkeys = JSON.parse(request.data);
        console.log(JSON.stringify(hotkeys));
      } else {
        if(request == "play-pause") click("#play-pause");
        if(request == "play-next") click("#play-next");
        if(request == "play-prev") click("#play-prev");
        if(request == "mute") click("#volume");
      }
    });
  });
})();