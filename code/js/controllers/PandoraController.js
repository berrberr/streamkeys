;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Pandora",
    playPause: ".playButton",
    play: ".playButton",
    pause: ".pauseButton",
    playNext: ".skipButton",
    like: ".thumbUpButton > a",
    dislike: ".thumbDownButton > a",

    song: ".songTitle",
    artist: ".artistSummary",
    album: ".albumTitle"
  });
})();
