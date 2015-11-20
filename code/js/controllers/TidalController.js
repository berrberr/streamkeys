;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Tidal",
    play: ".play-controls .js-play",
    pause: ".play-controls .js-pause",
    playNext: ".play-controls .icon-fast-forward",
    playPrev: ".play-controls .icon-fast-backward",

    song: "[data-test-id=track-title]",
    artist: "[data-test-id=artist-title]"
  });
})();
