;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Stitcher",
    playPause: "#audio_player-play",
    playNext: "#audio_player-skip",
    mute: "#audio_player-volume",

    playState: "#audio_content .playing",
    song: "#now_playing_title",

    hidePlayer: true
  });
})();
