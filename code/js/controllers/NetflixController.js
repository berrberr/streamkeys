;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Netflix",
    playPause: ".player-play-pause.play",
    play: ".player-play-pause.play",
    pause: ".player-play-pause.pause",
    playNext: ".player-next-episode",
    mute: ".player-control-button.volume",

    playState: ".player-play-pause.pause",
    song: ".player-status-main-title"
  });
})();
