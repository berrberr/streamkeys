;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Spotify",
    playPause: "#play-pause",
    playNext: "#next",
    playPrev: "#previous",
    like: "#track-add",
    iframe: "#app-player",

    playState: "#play-pause.playing",
    song: "#track-name",
    artist: "#track-artist"
  });
})();
