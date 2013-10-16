(function() {
  chrome.extension.sendMessage({action: "get_keys"}, function(resp) {
    var hotkeys = JSON.parse(resp);

    //***
    //These are the ids/class names of the elements to preform media player actions using the jquery click method
    //***
    var grooveshark_ids = {play_pause: "#play-pause", play_next: "#play-next", play_prev: "#play-prev", mute: "#volume"};
    var bandcamp_ids = {play_pause: ".playbutton", play_next: ".nextbutton", play_prev: ".prevbutton", mute: null};
    var rdio_ids = {play_pause: ".play_pause", play_next: ".next", play_prev: ".prev", mute: ".Volume"};

    //***
    //Check if a keydown event is some hotkey action
    //***
    function is_key_action(action, k) {
      if(action in hotkeys.codes && k !== null) {
        var obj = hotkeys.codes[action];
        return (obj.key == k.keyCode &&
                obj.modifier_alt == k.altKey &&
                obj.modifier_shift == k.shiftKey &&
                obj.modifier_ctrl == k.ctrlKey);
      }
      return false;
    }

    //***
    //Check for hotkey presses and send back requests to background script
    //***
    document.documentElement.addEventListener("keydown", function(k) {
      console.log(k.keyCode);
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

    //***
    //Send a click to an element
    //***
    function click(elementId) {
      $(elementId)[0].click();
    }

    //***
    //Recieve a request for media player action. Process request and send a click to requested element
    //***
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
      console.log("message recv" + request);
      if(request.action == "update_keys") {
        hotkeys = JSON.parse(request.data);
        console.log(JSON.stringify(hotkeys));
      } else {
        if(request.site == "grooveshark" && hotkeys.grooveshark_enabled) {
          console.log("GS CALL");
          if(request.action == "play-pause") click(grooveshark_ids.play_pause);
          if(request.action == "play-next") click(grooveshark_ids.play_next);
          if(request.action == "play-prev") click(grooveshark_ids.play_prev);
          if(request.action == "mute") click(grooveshark_ids.mute);
        }
        if(request.site == "bandcamp" && hotkeys.bandcamp_enabled) {
          console.log("BANDCAMP CALL");
          if(request.action == "play-pause") click(bandcamp_ids.play_pause);
          if(request.action == "play-next") click(bandcamp_ids.play_next);
          if(request.action == "play-prev") click(bandcamp_ids.play_prev);
        }
        if(request.site == "rdio" && hotkeys.rdio_enabled) {
          console.log("RDIO CALL");
          if(request.action == "play-pause") click(rdio_ids.play_pause);
          if(request.action == "play-next") click(rdio_ids.play_next);
          if(request.action == "play-prev") click(rdio_ids.play_prev);
          if(request.action == "mute") click(rdio_ids.mute);
        }
      }
    });
  });
})();