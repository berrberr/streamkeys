"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "DemoDrop",
    play: ".control.play",
    pause: ".control.stop",
    playNext: ".control.next",
    playPrev: ".control.previous",
    like: ".control.like",
    dislike: ".control.dislike",

    playState: "#player.playing",
    song: "#track-name"
  });
})();
