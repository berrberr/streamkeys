"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Noisli",

    playPause: ".mute-header img:not([style*='none;'])",
    playNext: "#random-button-out",
    mute: ".mute-header img:not([style*='none;'])",

    playState: "#sound-button-out:not([style*='none;'])",

    song: ".presets-ul .clicked"
  });
})();
