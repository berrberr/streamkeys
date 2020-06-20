"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Are.na",
    play: "#playPause button:nth-child(2)",
    pause: "#playPause button:nth-child(2)",
    playNext: "#playPause button:nth-child(3)",
    playPrev: "#playPause button:nth-child(1)",
    buttonSwitch: true,
    playState: "#nowPlaying .playerPlaying",
    song: "#nowPlaying .tile-wrap-full",
  });
})();
