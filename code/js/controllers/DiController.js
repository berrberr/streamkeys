"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Di.fm",
    play: ".icon-play",
    pause: ".icon-pause",
    mute: ".volume",
    like: ".icon-vote-up",
    dislike: ".icon-vote-down",

    playState: ".icon-pause",
    song: ".track-name"
  });
})();
