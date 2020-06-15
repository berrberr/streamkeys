"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Short Orange",
    playPause: ".player-controls > .play-button",
    playNext: ".player-controls .fa-forward",
    playPrev: ".player-controls .fa-backward",

    playState: ".player-controls > .play-button > .fa-pause",
    song: ".episode-title",
    artist: ".podcast-title",
    art: ".now-playing-art"
  });
})();
