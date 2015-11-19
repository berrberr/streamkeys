;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "The Edge",
    play: "#playButton",
    pause: "#stopButton",
    playStyle: "disabled",
    pauseStyle: "disabled",
    mute: ".vol-icon",

    song: "#songTitle",
    artist: "#songArtist"
  });
})();
