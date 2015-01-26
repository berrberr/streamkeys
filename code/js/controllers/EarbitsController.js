;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Earbits",
    playPause: ".btn-playpause",
    playNext: ".btn-skip",
    playPrev: ".btn-rewind",
    mute: ".btn-volume",
    like: ".like-icon",

    playState: ".btn-pause",
    song: ".track-name",
    artist: ".artist-name"
  });
})();
