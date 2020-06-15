"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Frisky Radio",
    play: ".f-player-ctrls .play",
    pause: ".f-player-ctrls .pause",
    buttonSwitch: true,
    playPrev: ".track-previous",
    mute: ".f-player-mute",
    song: ".f-player-song-title a"
  });
})();
