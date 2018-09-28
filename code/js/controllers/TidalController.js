;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Tidal",
    play: "[data-test-id=play]",
    pause: "[data-test-id=pause]",
    playNext: "[data-test-id=next]",
    playPrev: "[data-test-id=previous]",

    song: "[data-test-id=track-title]",
    artist: "[data-test-id=artist-title]",
    buttonSwitch : true
  });
})();
