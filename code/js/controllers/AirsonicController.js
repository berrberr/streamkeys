"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    iframe: "frame[name=playQueue]",
    play: "button[aria-label=Play]",
    pause: "button[aria-label=Pause]",
    playNext: "img[onclick^=onNext]",
    playPrev: "img[onclick^=onPrev]",
    mute: "button[aria-label$=\"ute\"]",
    buttonSwitch: true,

    song: "img[src$=\"current.png\"]:not([style*=\"none\"]) + span a",
  });
})();
