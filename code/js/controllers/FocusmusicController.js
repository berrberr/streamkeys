"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Focusmusic",
    play: ".fa.play-pause.fa-play-circle",
    pause: ".fa.play-pause.fa-pause-circle",
    playNext: ".fa.controls.next.fa-fast-forward",
    playPrev: ".fa.controls.previous.fa-fast-backward",

    playState: ".fa.play-pause.fa-pause-circle",
    song: ".track-title",
    artist: ".artist"
  });
})();
