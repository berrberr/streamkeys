"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Hofer life music",
    play: ".player-play-button .icon-play-button",
    pause: ".player-play-button .icon-pause2",
    playNext: ".player-advance-button",
    playPrev: ".player-rewind-button",
    like: ".like-button",
    dislike: ".dislike-button",
    buttonSwitch: true,

    song: ".player-track",
    artist: ".player-artist"
  });
})();
