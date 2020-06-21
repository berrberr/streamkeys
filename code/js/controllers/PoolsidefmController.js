"use strict";
(function () {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Poolside FM",
    playPause: ".flex button.middle",
    playNext: ".flex button.last",
    playPrev: ".flex button.first",
    like: ".flex button.favourite",

    buttonSwitch: true,

    playState: ".flex button.middle:not(.paused)",
    song: ".current-track h3",
    artist: ".current-track h2",
  });
})();
