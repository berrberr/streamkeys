;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Short Orange",
    play: ".player-controls .fa-play",
    pause: ".player-controls .fa-pause",
    playNext: ".player-controls .fa-forward",
    playPrev: ".player-controls .fa-backward",

    playState: ".fa-pause:not(.ng-hide)",
    song: ".episode-title",
    artist: ".podcast-title"
  });
})();
