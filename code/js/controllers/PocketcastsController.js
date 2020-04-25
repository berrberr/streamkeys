;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Pocketcasts",
    playPause: ".play_pause_button",
    playNext: ".skip-forward-button",
    playPrev: ".skip-back-button",
    mute: ".audio_volume_slider",

    playState: ".play_pause_button.pause_button",
    song: ".player_episode",
    artist: ".player_podcast_title"
  });
})();
