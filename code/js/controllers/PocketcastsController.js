"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Pocket Casts",
    playPause: "button.skip_back_button + button",
    playNext: ".skip-forward-button",
    playPrev: ".skip-back-button",
    mute: ".player-controls-mute-button",

    playState: "button.skip_back_button + button[aria-pressed=true]",
    song: ".player_episode",
    artist: ".player_podcast_title"
  });
})();
