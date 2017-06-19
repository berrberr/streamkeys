(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Blitzr",
    play: ".fa-play",
    pause: ".fa-pause",
    playNext: ".fa-step-forward",
    playPrev: ".fa-step-backward",
    mute: ".fa-stack",

    playState: ".fa-pause",
    song: "#playerTitle",
    artist: "#playerArtists"
  });
})();
