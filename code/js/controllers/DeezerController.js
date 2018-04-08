;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Deezer",
    playPause: ".control.control-play",
    playNext: ".control.control-next",
    playPrev: ".control.control-prev",
    mute: ".icon-volume-off",
    like: ".player-actions .icon-love",
    dislike: ".player-actions .icon-unlove",
    playState: ".control.control-play > .svg-icon-pause",

    song: ".player-track-title > a",
    artist: ".player-track-artist > a"
  });
})();
