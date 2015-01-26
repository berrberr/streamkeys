;(function() {
  "use strict";

  require("BaseController").init({
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
