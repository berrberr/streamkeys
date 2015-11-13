;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "The Drop",
    playPause: ".button-left.play-button",
    play: ".button-left.play-button",
    pause: ".pause-button",
    playNext: ".next-button",
    playPrev: ".prev-button",
    mute: ".volume-button",
    like: ".music-player .favorite-button",

    playState: ".button-left.pause-button",
    song: ".playing-title"
  });
})();
