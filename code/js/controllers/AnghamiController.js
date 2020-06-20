"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Anghami",
    dislike: "#player .icon-liked",
    like: "#player .icon-like",
    playNext: "#player .next",
    playPause: "#player .playpause",
    playPrev: "#player .previous",
    play: "#player .icon-play",
    pause: "#player .icon-pause-2",
    artist: "#player .track-artist",
    playState: ".playing",
    buttonSwitch: true,
    song: "#player .track-title a"
  });
})();
