;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Tidal",
    play: ".js-play",
    pause: ".js-pause",
    playNext: ".icon-fast-forward",
    playPrev: ".icon-fast-backward",

    song: "[data-test-id=track-title]",
    artist: "[data-test-id=artist-title]"
  });
})();
