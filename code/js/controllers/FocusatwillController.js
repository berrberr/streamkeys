"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Focusatwill",
    play: ".playButton",
    pause: ".playButton",
    playNext: ".skipButton",
    buttonSwitch: true,

    song: ".c1Dhs",
    artist: ".c1Dhs"
  });
})();
