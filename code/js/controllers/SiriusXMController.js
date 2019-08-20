(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "SiriusXM",
    playPause: ".play",
    playNext: ".next",
    playPrev: ".prev",
    mute: ".minimized-volume-control",

    playState: ".play[aria-label='Pause audio']",
    song: ".np-track-artist",
    album: ".np-track-show-name", //"Show" name
    art: "#fallbackImg"
  });
})();
