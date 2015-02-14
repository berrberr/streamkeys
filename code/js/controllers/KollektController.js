;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Kollet.fm",
    playPause: ".fa-play",
    playNext: ".fa-forward",
    playPrev: ".fa-backward",
    like: ".fa-heart",

    playState: ".fa-play.fa-pause",
    song: ".current-track-title .track"
  });
})();
