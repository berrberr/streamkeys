"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Qobuz",

    play: ".pct-player-play",
    pause: ".pct-player-pause",
    playNext: ".pct-player-next",
    playPrev: ".pct-player-prev",
    buttonSwitch: true,


    playState: ".pct-player-pause",
    song: ".current-track",
    artist: ".link-artist"
  });
})();
