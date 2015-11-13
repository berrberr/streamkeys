;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "RadioSwissJazz",
    playPause: "[role=play]",
    play: "[role=play]",
    pause: "[role=stop]",

    playState: ".jp-state-playing",
    song: ".current-airplay .titletag",
    artist: ".current-airplay .artist"
  });
})();
