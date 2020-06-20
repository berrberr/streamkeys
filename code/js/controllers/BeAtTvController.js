"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "BE-AT.TV",
    play: ".btn.playbutton",
    pause: ".btn.pausebutton",
    mute: ".btn.volume",
    song: ".ticker",
    playState: ".btn.pausebutton"
  });
})();
