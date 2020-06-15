"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Last.fm",
    play: ".player-bar-btn--play",
    pause: ".player-bar-btn--pause",
    playNext: ".player-bar-btn--next",
    playPrev: ".player-bar-btn--previous",
    like: ".player-bar-btn--love",

    playState: ".player-bar-btn--pause",
    song: ".player-bar-track-name",
    artist: ".player-bar-artist-name"
  });
})();
