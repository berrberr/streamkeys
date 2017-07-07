(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "OPlayer",
    play: ".jp-play",
    pause: ".jp-pause",
    playNext: ".jp-forward",
    playPrev: ".jp-backward",
    like: ".x-playing .fa-heart-o",
    dislike: ".x-playing .fa-heart",

    playState: ".jp-state-playing",
    song: ".jp-title"
  });
})();
