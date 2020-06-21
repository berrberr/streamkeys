"use strict";
(function() {
  var BaseController = require("BaseController");

  if (document.getElementById("js-pod-player")) {
    //audio player
    new BaseController({
      siteName: "Giantbomb",
      play: ".av-play",
      pause: ".av-pause",

      playState: ".podcast-active"
    });
  } else {
    //video player
    new BaseController({
      siteName: "Giantbomb",
      playPause: ".js-vid-play-pause",
      play: ".av-play",
      pause: ".av-play",

      playState: ".video-playing"
    });
  }

})();
