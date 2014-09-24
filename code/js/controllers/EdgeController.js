;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "#playButton",
    play: "#playButton",
    pause: "#stopButton",
    playStyle: "disabled",
    pauseStyle: "disabled",
    mute: ".vol-icon"
  });
})();
