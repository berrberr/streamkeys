"use strict";

(function () {
  var BaseController = require("BaseController");

  new BaseController({
    playPause: ".vjs-play-control",
    playNext: ".curriculum-rightarrow",
    playPrev: ".curriculum-leftarrow",
    mute: ".vjs-mute-control",

    playState: ".vjs-play-control:not(.vjs-paused)",
    song: ".lesson-row-active"
  });
})();
