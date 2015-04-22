;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Soundsgood.co",
    playPause: ".control-play",
    playNext: ".icon-fast-fw",
    playPrev: ".icon-fast-bw",

    playState: ".control-play.state-playing",
    song: ".track-title",
    artist: ".track-artist"
  });
})();
