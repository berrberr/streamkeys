"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "RadioSwissJazz",
    play: "[role=play]",
    pause: "[role=stop]",

    playState: ".jp-state-playing",
    song: ".current-airplay .titletag",
    artist: ".current-airplay .artist"
  });
})();
