"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Tidal",
    play: "[data-test=play]",
    pause: "[data-test=pause]",
    playNext: "[data-test=next]",
    playPrev: "[data-test=previous]",

    song: "[data-test=track-title]",
    artist: "[data-test=artist-title]",
    buttonSwitch : true
  });
})();
