"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Audiotool",
    playPause: "a.global.play",
    playNext: "a.forward",
    playPrev: "a.rewind",
    like: ".like.big",

    playState: ".global.play.playing",
    song: "._trackProfileLink",
    artist: "._artistProfileLink",
  });
})();
