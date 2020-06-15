"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Songza",
    playPause: ".miniplayer-control-play-pause",
    playNext: ".miniplayer-control-skip",
    mute: ".miniplayer-volume-icon",
    like: ".thumb-up",
    dislike: ".thumb-down",

    playState: ".player-state-play",
    song: ".miniplayer-info-track-title"
  });

  controller.getStateData = function() {
    var artistSpan = document.querySelector(".miniplayer-info-artist-name a") &&
                      document.querySelector(".miniplayer-info-artist-name a").textContent.substring(3);

    return {
      song: this.getSongData(this.selectors.song),
      artist: artistSpan,
      isPlaying: this.isPlaying(),
      siteName: this.siteName,
      canPlayPause: true,
      canPlayNext: true,
      canLike: true,
      canDislike: true
    };
  };
})();
