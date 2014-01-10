console.log(this.chrome);

//chrome.tabs.getCurrent(function(tab){console.log("***TAB" + tab);});
//var hotkeys = JSON.parse(resp);

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
  console.log("message recv", request);
  if(request.action == "update_keys") {
    hotkeys = JSON.parse(request.data);
    console.log(JSON.stringify(hotkeys));
  } else {
    if(typeof request !== 'undefined') {
      console.log("CALL: " + request.site);
      click(site_ids[request.site][request.action], request.site);
    }
  }
});