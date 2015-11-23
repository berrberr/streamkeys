;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Shuffler.fm",
    playPause: "#play-pause",
    playNext: "#next",
    playPrev: "#prev",
    like: "#favorite",

    playState: ".pause",
    song: ".track-title",
    artist: ".artist-name"
  });
})();
