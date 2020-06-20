"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Pocket Casts",
    playPause: ".play_pause_button",
    playNext: ".skip-forward-button",
    playPrev: ".skip-back-button",
    mute: ".player-controls-mute-button",

    playState: ".play_pause_button.pause_button",
    song: ".player_episode",
    artist: ".player_podcast_title"
  });
})();
