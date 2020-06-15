"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "ListenOnRepeat",
    play: ".mdi-av-play-arrow",
    pause: ".mdi-av-pause",
    playNext: ".mdi-av-skip-next",
    playPrev: ".mdi-av-skip-previous",
    like: ".control-heart",
    buttonSwitch: true,

    song: ".player-controls .video-title"
  });
})();
