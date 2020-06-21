"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Disi",
    playPause: ".youtube-player",
    song: ".song_container .title h3",
    playNext: ".youtube-player-toolbar li:nth-child(2)",
    playPrev: ".youtube-player-toolbar li"
  });

})();
