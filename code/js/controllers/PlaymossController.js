"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Playmoss",
    play: "#controller .play",
    pause: "#controller .pause",
    playNext: "#controller .next",
    playPrev: "#controller .prev",

    song: ".track.playing a"
  });
})();
