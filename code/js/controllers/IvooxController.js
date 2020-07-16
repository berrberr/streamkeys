"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "ivoox",
    play: ".jp-play2 a",
    pause: ".jp-pause2 a",

    playState: ".jp-pause2",
    song: ".cont-text h1"
  });
})();
