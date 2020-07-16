"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Google Play Music",
    playPause: "[data-id=play-pause]",
    playNext: "[data-id=forward]",
    playPrev: "[data-id=rewind]",
    like: ".rating-container [data-rating='5']",
    dislike: ".rating-container [data-rating='1']",

    playState: "[data-id=play-pause].playing",
    song: "#currently-playing-title",
    artist: "#player-artist",
    album: ".player-album",
    art: "#playerBarArt",
    currentTime: "#time_container_current",
    totalTime: "#time_container_duration"
  });
})();
