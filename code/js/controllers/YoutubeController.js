;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: ".ytp-button-play",
    play: ".ytp-button-play",
    pause: ".ytp-button-pause",
    playNext: ".next-playlist-list-item",
    playPrev: ".prev-playlist-list-item",
    mute: ".ytp-button-volume",
    buttonSwitch: true
  });
})();
