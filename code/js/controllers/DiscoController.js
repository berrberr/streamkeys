;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Disco.io",
    playPause: "#play-button",
    playNext: "#next-button",
    playPrev: "#previous-button",

    playState: "#play-button.pause",
    song: "#current-track-title",
    artist: "#current-track-artist"
  });
})();
