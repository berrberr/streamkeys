"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Naver Music",
    playPause: ".player_controller .play",
    playNext: ".player_controller .next",
    playPrev: ".player_controller .prev",
    mute: ".player_controller .volume",

    playState: ".player_controller .play.is_paused",
    song: ".info_song p:first-child span",
    artist: ".info_artist .name",
    art: ".player_cover img"
  });
})();
