"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Myspace",
    playPause: ".play",
    playNext: ".next",
    playPrev: ".previous",
    mute: "#volumeBtn",

    playState: "[data-original-title=Pause]",
    song: ".track > .title > a",
    artist: ".track > .artist > a",

    hidePlayer: true
  });
})();
