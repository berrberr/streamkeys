;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Phish Just Jams",
    playPause: "button.btn-controls:nth-of-type(2)",
    playNext: "button.btn-controls:nth-of-type(3)",
    playPrev: "button.btn-controls:nth-of-type(1)",

    playState: ".np_playing",
    song: ".npTitle",
    artist: ".npVenue"
  });
})();
