;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Cubic.fm",
    playPause: ".player-button-play",
    play: ".player-button-play .fa-play",
    pause: ".player-button-play .fa-pause",
    playNext: ".player-button-next",
    playPrev: ".player-button-prev",
    mute: ".player-button-vol .volume-icon",

    playState: ".player-button-play .fa-pause",
    song: ".track-songtitle"
  });
})();
