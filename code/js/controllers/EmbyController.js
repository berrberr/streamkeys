;(function() {
  "use strict";

  var controller = require("BaseController");

  controller.init({
    siteName: "Emby",
    play: ".unpauseButton",
    pause: ".pauseButton",
    playNext: ".nextTrackButton",
    playPrev: ".previousTrackButton",

    pauseState: ".pauseButton.hide",
    playState: ".unpauseButton.hide"
  });
})();
