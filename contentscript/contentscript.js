(function() {
  chrome.extension.sendMessage({action: "get_keys"}, function(resp) {
    var hotkeys = JSON.parse(resp);

    //***
    //These are the ids/class names of the elements to preform media player actions using the jquery click method
    //***
    var site_ids = {
      bandcamp: {play_pause: ".playbutton", play_next: ".nextbutton", play_prev: ".prevbutton", mute: null},
      grooveshark: {play_pause: "#play-pause", play_next: "#play-next", play_prev: "#play-prev", mute: "#volume"},
      pandora: {play_pause: ".playButton", play: ".playButton", pause: ".pauseButton", play_next: ".skipButton", play_prev: null, mute: null},
      rdio: {play_pause: ".play_pause", play_next: ".next", play_prev: ".prev", mute: ".Volume"},
      spotify: {play_pause: "#play-pause", play_next: "#next", play_prev: "#previous", mute: null}
    };

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
    //TODO: rdio by default captures media key presses, so ignore media key capture when sent from rdio tab?
    //***
    document.documentElement.addEventListener("keydown", function(k) {
      if(is_key_action("play", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_play) {
        chrome.extension.sendMessage({action:"play_pause"});
        console.log("send play-pause");
      }
      if(is_key_action("next", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_next) {
        chrome.extension.sendMessage({action:"play_next"});
        console.log("send play-next");
      }
      if(is_key_action("prev", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_prev) {
        chrome.extension.sendMessage({action:"play_prev"});
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
    function click(elementId, site) {
      if(site == "spotify") {
        if(elementId !== null) $("#app-player").contents().find(elementId).trigger("click");
      }
      else if(site == "pandora") {
        if(elementId !== null) {
          if(elementId == pandora_ids.play_pause) {
            if($(pandora_ids.pause).css('display') == 'none'){
              $(pandora_ids.play)[0].click();
            }
            else if($(pandora_ids.play).css('display') == 'none') {
              $(pandora_ids.pause)[0].click();
            }
          }
          else {
            $(elementId)[0].click();
          }
        }
      }
      else {
        if(elementId !== null) $(elementId)[0].click();
      }
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
        if(typeof request !== 'undefined') {
          if(hotkeys.sites[request.site]) {
            console.log("CALL: " + request.site);
            click(site_ids[request.site][request.action], request.site);
          }
        }
      }
    });
  });
})();