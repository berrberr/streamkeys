"use strict";
(function() {
  var BaseController = require("BaseController");

  // No playstate available
  new BaseController({
    siteName: "Songstr",
    playPause: "#do-play",
    playNext: "#next",
    playPrev: "#previous",

    song: ".song",
    artist: ".artist"
  });
})();
