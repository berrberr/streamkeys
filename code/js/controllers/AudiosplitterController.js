;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Audiosplitter",
    play: ".p-controls .as-icon-play",
    pause: ".p-controls .as-icon-pause",
    playNext: ".p-controls .as-icon-forward",
    playPrev: ".p-controls .as-icon-backward",

    song: ".p-title",
    artist: ".p-artist"
  });
})();
