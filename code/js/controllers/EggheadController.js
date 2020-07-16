"use strict";
(function () {
  var playButtonSelector = ".wistia_romulus_control[id^='wistia_'][id*='PlayButton']";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    playPause: playButtonSelector,

    playNext: "#quick-skip",
    playPrev: "#quick-rewind",

    like: "#lesson-like",
    dislike: "#lesson-dislike",

    song: ".lesson-video-container h1.title",
    artist: ".lesson-video-container p.line-lesson-author a:last-of-type"
  });

  controller.isPlaying = function () {
    return !(this.doc().querySelector(playButtonSelector + ".paused"));
  };
})();
