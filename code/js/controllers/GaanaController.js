;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Gaana",
    playPause: ".playPause",
    playNext: ".next",
    playPrev: ".previous",
    mute: ".mute",

    playState: ".playPause.pause"
  });
})();
