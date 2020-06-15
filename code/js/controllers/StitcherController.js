"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Stitcher",
    playPause: "#audio_player-play",
    playNext: "#audio_player-skip",
    mute: "#audio_player-volume",

    playState: "#audio_content .playing",
    song: ".current-playlist-playing strong",
    artist: ".current-playlist-playing dfn",
    art: ".current-playlist-playing img",

    currentTime: "#audio_player-time",
    totalTime: "#audio_player-duration",

    hidePlayer: true
  });
})();
