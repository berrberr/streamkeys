"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Google Podcasts",
    play: "div[aria-label=Play]",
    pause: "div[aria-label=Pause]",
    playNext: "div[aria-label='Fast forward 30 seconds']",
    playPrev: "div[aria-label='Rewind 10 seconds']",

    playState: "div[aria-label=Pause]"
  });
})();
