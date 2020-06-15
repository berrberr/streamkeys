"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Accuradio",
    play: "#playerPlayButton",
    pause: "#playerPauseButton",
    playNext: "#playerSkipButton",
    buttonSwitch: true,

    song: "#songtitle",
    artist: "#songartist"
  });
})();
