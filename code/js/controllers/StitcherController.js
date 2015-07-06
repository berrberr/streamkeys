;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Stitcher",
    playPause: "#audio_player-play",
    playNext: "#audio_player-skip",
    mute: "#audio_player-volume",

    playState: "#audio_content .playing",
    song: "#now-playing-feed-title",

    hidePlayer: true
  });
})();
