;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Short Orange",
    playPause: ".fa-play",
    play: ".fa-play",
    pause: ".fa-pause",
    playNext: ".fa-forward",
    playPrev: ".fa-backward",

    playState: ".fa-play.ng-hide",
    song: ".episode-title",
    artist: ".podcast-title"
  });
})();
