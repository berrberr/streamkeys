"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Earbits",
    playPause: ".btn-playpause",
    playNext: ".btn-skip",
    playPrev: ".btn-rewind",
    mute: ".btn-volume",
    like: ".like-icon",

    playState: ".btn-pause",
    song: ".track-name",
    artist: ".artist-name"
  });
})();
