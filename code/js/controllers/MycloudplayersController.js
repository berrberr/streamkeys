"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "My Cloud Player",
    playPause: ".playtoggle",
    playNext: ".fa-fast-forward",
    playPrev: ".fa-fast-backward",
    mute: ".fa-volume-up",

    playState: ".playtoggle.pause"
  });
})();
