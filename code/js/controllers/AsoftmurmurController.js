"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "A Soft Murmur",
    playPause: "#pb",
    mute: "#mute-button",

    playState: "#pb.playing"
  });
})();
