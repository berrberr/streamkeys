"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Reddit Music Player",
    playPause: ".ui.controls .play.button",
    playNext: ".ui.controls .forward.button",
    playPrev: ".ui.controls .backward.button",
    like: ".current.song .upvote",
    dislike: ".current.song .downvote",

    playState: ".ui.controls .play.button.active",
    song: ".current.song .title"
  });
})();
