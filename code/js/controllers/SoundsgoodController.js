"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Soundsgood.co",
    playPause: ".control-play",
    playNext: ".icon-fast-fw",
    playPrev: ".icon-fast-bw",

    playState: ".control-play.state-playing",
    song: ".track-infos .track-title",
    artist: ".track-infos .track-artist"
  });
})();
