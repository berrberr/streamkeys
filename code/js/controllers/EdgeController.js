;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "The Edge",
    play: "#playButton",
    pause: "#stopButton",
    mute: ".vol-icon",

    playState: "#playButton.disabled",
    song: "#songTitle",
    artist: "#songArtist"
  });
})();
