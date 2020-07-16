"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "QQ Music",
    playPause: "#btnplay",
    playNext: ".btn_big_next",
    playPrev: ".btn_big_prev",
    like: ".btn_big_like",

    playState: "#btnplay.btn_big_play--pause",
    song: "#song_name a",
    artist: "#singer_name a",
    album: "#album_name a"
  });
})();
