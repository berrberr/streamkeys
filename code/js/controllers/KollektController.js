;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Kollekt.fm",
    playPause: ".controls .fa-play",
    playNext: ".controls .fa-forward",
    playPrev: ".controls .fa-backward",
    like: ".controls .fa-heart",

    playState: ".controls .fa-play.fa-pause",
    song: ".current-track-title .track"
  });
})();
