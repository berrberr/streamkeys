"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    iframe: "#playQueue",
    play: "#startButton",
    pause: "#stopButton",
    playNext: "#nextButton",
    playPrev: "#previousButton",
    mute: "#muteOn",

    song: "#songName",
    artist: "#artistName"
  });
})();
