"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "7digital",
    playPause: ".player-play-pause",
    playNext: ".player-next",
    playPrev: ".player-previous",
    mute: "#player-mute-toggle-btn",

    playState: ".player-play-pause:not(.paused)",
    song: "#player-now-playing-title",
    artist: "#player-now-playing-artist"
  });
})();
