;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Tidal",
    play: ".js-play",
    pause: ".js-pause",
    playNext: ".icon-fast-forward",
    playPrev: ".icon-fast-backward",

    song: "[data-test-id=track-title]",
    artist: "[data-test-id=artist-title]"
  });
})();
