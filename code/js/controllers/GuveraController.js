;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Guvera",
    play: ".paused",
    pause: ".playing",
    playNext: ".next-track",
    playPrev: ".prev-track",

    playState: ".playing"
  });
})();
