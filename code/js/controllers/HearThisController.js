"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Hear This",
    play: ".play_track a",
    pause: ".pause_track a",
    playNext: ".play_next a",
    playState: "body.play",
    song: ".playing"
  });
})();
