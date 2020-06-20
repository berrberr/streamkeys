"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Wynk",
    playPause: ".splay i",
    playNext: ".snext i",
    playPrev: ".sprevious i",
    mute: ".volume i",

    playState: "[title='Pause']"
  });
})();
