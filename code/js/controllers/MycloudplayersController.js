;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "My Cloud Player",
    playPause: ".playtoggle",
    playNext: ".fa-fast-forward",
    playPrev: ".fa-fast-backward",
    mute: ".fa-volume-up",

    playState: ".playtoggle.pause"
  });
})();
