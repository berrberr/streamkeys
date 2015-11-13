;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Emby",
    play: ".unpauseButton",
    pause: ".pauseButton",
    playNext: ".nextTrackButton",
    playPrev: ".previousTrackButton",

    pauseState: ".pauseButton.hide",
    playState: ".unpauseButton.hide"
  });
})();
