"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "TuneIn",
    playPause: ".playbutton-cont",

    playState: "#tuner.playing",
    song: ".line1._navigateNowPlaying"
  });
})();
