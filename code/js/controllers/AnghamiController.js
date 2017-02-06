;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Anghami",
    dislike: "#player .like.active",
    like: "#player .like:not(.active)",
    playNext: "#player .next",
    playPause: "#player .play-pause-button",
    playPrev: "#player .previous",

    album: "",
    artist: "#player .track-artist",
    playState: "#player .paused",
    song: "#player .track-title a"
  });
})();
