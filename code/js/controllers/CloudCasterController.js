"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Cloud Caster",
    play: ".jp-play",
    pause: ".jp-pause",
    playNext: "#skip30",
    playPrev: "#back30",

    playState: ".jp-flat-audio.jp-state-playing",
    song: ".span8.fg-color-darken.text-center p",
    artist: ".page-header-content h1"
  });
})();
