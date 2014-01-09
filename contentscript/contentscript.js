(function() {
  chrome.runtime.sendMessage({action: "get_keys"}, function(resp) {
    var hotkeys = JSON.parse(resp);

    //***
    //These are the ids/class names of the elements to preform media player actions using the jquery click method
    //***
    var site_ids = {
      "8tracks": {play_pause: "#player_play_button", play: "#player_play_button", pause: "#player_pause_button", play_next: "#player_skip_button", play_prev: null, mute: ".volume-mute"},
      "bandcamp": {play_pause: ".playbutton", play_next: ".nextbutton", play_prev: ".prevbutton", mute: null},
      "deezer": {play_pause: "#player_control_pause", play: "#player_control_play", pause: "#player_control_pause", play_next: "#player_control_next", play_prev: "#player_control_prev", mute: "#player_volume_mute"},
      "grooveshark": {play_pause: "#play-pause", play_next: "#play-next", play_prev: "#play-prev", mute: "#volume"},
      "hypem": {play_pause: "#playerPlay", play_next: "#playerNext", play_prev: "#playerPrev", mute: "#player-volume-mute"},
      "myspace": {play_pause: ".play", play_next: ".next", play_prev: ".previous", mute: "#volumeBtn"},
      "pandora": {play_pause: ".playButton", play: ".playButton", pause: ".pauseButton", play_next: ".skipButton", play_prev: null, mute: null},
      "rdio": {play_pause: ".play_pause", play_next: ".next", play_prev: ".prev", mute: ".Volume"},
      "spotify": {play_pause: "#play-pause", play_next: "#next", play_prev: "#previous", mute: null},
      "soundcloud": {play_pause: ".playControl", play_next: ".skipControl__next", play_prev: ".skipControl__previous", mute: ".volume__togglemute"}
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
        chrome.runtime.sendMessage({action:"play_pause"});
        console.log("send play-pause");
      }
      if(is_key_action("next", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_next) {
        chrome.runtime.sendMessage({action:"play_next"});
        console.log("send play-next");
      }
      if(is_key_action("prev", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_prev) {
        chrome.runtime.sendMessage({action:"play_prev"});
        console.log("send play-prev");
      }
      if(is_key_action("mute", k) || hotkeys.mk_enabled && k.keyCode == hotkeys.mk_codes.mk_mute) {
        chrome.runtime.sendMessage({action:"mute"});
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
      //These sites have play/pause buttons that switch when they are clicked, ie. two different divs/ids
      else if(site == "pandora" || site == "deezer" || site == "8tracks") {
        if(elementId !== null) {
          if(elementId == site_ids[site].play_pause) {
            if($(site_ids[site].pause).css('display') == 'none'){
              $(site_ids[site].play)[0].click();
            }
            else if($(site_ids[site].play).css('display') == 'none') {
              $(site_ids[site].pause)[0].click();
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
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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