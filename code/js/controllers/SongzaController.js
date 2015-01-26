;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Songza",
    playPause: ".miniplayer-control-play-pause",
    playNext: ".miniplayer-control-skip",
    mute: ".miniplayer-volume-icon",

    playState: ".player-state-play",
    song: ".miniplayer-info-track-title"
  });
})();
