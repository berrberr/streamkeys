;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "#playButton",
    play: "#playButton",
    pause: "#stopButton",
    playStyle: "disabled",
    pauseStyle: "disabled",
    mute: ".vol-icon"
  });
})();
