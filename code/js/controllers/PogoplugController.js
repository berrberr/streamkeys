"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Pogoplug",
    play: ".play",
    pause: ".pause",
    playNext: ".next",
    playPrev: ".prev",
    buttonSwitch: true,
    song: "#audioplayer_nowinfo"
  });
})();
