"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Kollekt.fm",
    playPause: "#player-controls .fa-play",
    playNext: "#player-controls .fa-forward",
    playPrev: "#player-controls .fa-backward",
    like: "#player-controls .fa-heart",

    playState: "#player-controls .fa-play.fa-pause",
    song: ".current-track-title .track"
  });
})();
