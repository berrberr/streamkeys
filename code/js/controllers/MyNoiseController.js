;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "myNoise",
    playPause: "#mute",

    song: ".noiseTitle .bigTitle",
    playState: "#mute:not(.active)",
  });
})();
