"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "NoiseSupply",
    playPause: ".player",
    playNext: ".skip",
    playState: ".fa-pause",
    song: ".title",
    artist: ".user"
  });
})();
