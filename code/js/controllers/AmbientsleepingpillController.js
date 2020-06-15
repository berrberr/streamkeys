"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "AmbientSleepingPill",
    play: ".jp-play",
    pause: ".jp-pause",

    playState: "#jp_container_1.jp-state-playing",
    song: "#cc_strinfo_tracktitle_asp",
    artist: "#cc_strinfo_trackartist_asp"
  });
})();
