"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "NPR News Player",
    play: "#npr-player .player-play-pause-stop",
    pause: "#npr-player .player-play-pause-stop",
    playPrev: "#npr-player .player-rewind",
    playNext: "#npr-player .player-skip",

    playState: "#npr-player .icn-pause",
    song: "#npr-player .track-meta.track-meta-one",

    hidePlayer: true
  });
})();
