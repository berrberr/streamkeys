;(function() {
  "use strict";

  var controller = require("BaseController");

  controller.init({
    siteName: "Songza",
    playPause: ".miniplayer-control-play-pause",
    playNext: ".miniplayer-control-skip",
    mute: ".miniplayer-volume-icon",

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
      siteName: this.siteName
    };
  };
})();
