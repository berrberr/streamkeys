;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Tidal",
    play: ".play-controls .js-play",
    pause: ".play-controls .js-pause",
    playNext: ".play-controls .js-next",
    playPrev: ".play-controls .js-previous",

    song: "[data-test-id=track-title]",
    artist: "[data-test-id=artist-title]"
  });
})();
