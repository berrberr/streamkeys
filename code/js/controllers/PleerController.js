;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Pleer",
    playPause: "#play",
    playNext: "#fw",
    playPrev: "#rw",

    playState: "#play.pause"
  });
})();
