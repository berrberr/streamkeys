(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Udemy",
    playPause: ".vjs-play-control",
    play: ".vjs-play-control",
    pause: ".vjs-play-control",
    playNext: ".btn-control[class*=continue-button]",
    mute: ".vjs-audio-button",
    playState: ".vjs-playing",
    buttonSwitch: true
  });
})();
