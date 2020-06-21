"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Duckburg Radio",

    playPause: "#radiomb-play",
    mute : "#radiomb-volume",

    playState: "#radiomb-play.radiomb-playing",

    song: "#radiomb-np-title",
    artist: "#radiomb-np-artist"
  });
})();
