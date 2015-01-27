;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "7digital",
    playPause: ".player-play-pause",
    playNext: ".player-next",

    playState: ".player-play-pause:not(.paused)",
    song: "#player-now-playing-title",
    artist: "#player-now-playing-artist"
  });
})();
