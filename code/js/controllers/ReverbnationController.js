"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Reverb Nation",
    playPause: ".btn_play",
    play: ".btn_play",
    pause: ".btn_pause",
    playNext: ".btn_next",
    playPrev: ".btn_prev",
    like: ".thumb",

    song: ".song_info.active [data-role=title]",
    artist: ".song_info.active [data-role=artist]"
  });
})();
