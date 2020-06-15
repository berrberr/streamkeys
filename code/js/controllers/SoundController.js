"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Sound.is",
    playPause: "#play_button",

    playState: "#play_button.pause",
    song: "title"
  });
})();
