;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "The Edge",
    playPause: "#playButton",
    play: "#playButton",
    pause: "#stopButton",
    playStyle: "disabled",
    pauseStyle: "disabled",
    mute: ".vol-icon",

    song: "#songTitle",
    artist: "#songArtist"
  });
})();
