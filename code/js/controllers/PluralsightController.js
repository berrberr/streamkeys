(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Pluralsight",
    playPause: "#play-control",
    play: "#play-control",
    pause: "#play-control",
    playNext: "#flashforward-control",
    playPrev: "#flashback-control",

    playState: ".vjs-playing"
  });
})();
