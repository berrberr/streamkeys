;(function () {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "musicForProgramming",
    playPause: "#player_playpause",
    playPrev: "#player_rew",
    playNext: "#player_ffw",
    song: "title"
  });
})();
