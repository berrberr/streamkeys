"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "koel",
    play: ".play.control",
    pause: ".pause.control",
    playNext: ".next.control",
    playPrev: ".prev.control",
    like: ".like.control",

    playState: ".pause.control",
    song: ".progress .title",
    artist: ".progress .artist",
    album: ".progress .album"
  });
})();
