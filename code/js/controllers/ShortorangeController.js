;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Short Orange",
    playPause: ".jp-play .fa-play",
    play: ".jp-play .fa-play",
    pause: ".jp-play .fa-pause",
    playNext: ".fa-forward",
    playPrev: ".fa-backward",

    playState: ".fa-play.ng-hide",
    song: ".episode-title",
    artist: ".podcast-title"
  });
})();
