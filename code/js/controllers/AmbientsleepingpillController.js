;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "AmbientSleepingPill",
    play: ".jp-play",
    pause: ".jp-pause",

    song: "#cc_strinfo_tracktitle_asp",
    artist: "#cc_strinfo_trackartist_asp"
  });
})();
