;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "The Drop",
    play: ".glyphicon-play",
    pause: ".glyphicon-pause",
    playNext: ".glyphicon-forward",
    playPrev: ".glyphicon-backward",
    mute: "#player-mute-toggle",

    playState: ".glyphicon-pause",
    song: ".player--body .track-title > span",
    artist: ".player--body .artist-name"
  });
})();
