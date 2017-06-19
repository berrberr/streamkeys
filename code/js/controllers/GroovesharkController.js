(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Grooveshark",
    playPrev: "#controls > button:nth-child(1)",
    play: "#controls > button:nth-child(2)",
    pause: "#controls > button:nth-child(3)",
    playNext: "#controls > button:nth-child(4)",
    song: "#trackInfo",
    artist: "#artistInfo",
    buttonSwitch: true
  });
})();
