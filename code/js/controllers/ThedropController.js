;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "The Drop",
    playPause: ".button-left.play-button",
    play: ".button-left.play-button",
    pause: ".pause-button",
    playNext: ".next-button",
    playPrev: ".prev-button",
    mute: ".volume-button",

    playState: ".button-left.pause-button",
    song: ".playing-title"
  });
})();
