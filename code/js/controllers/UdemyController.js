"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Udemy",
    playPause: "[data-purpose=play-button]",
    play: "[data-purpose=play-button]",
    pause: "[data-purpose=pause-button]",
    playNext: "[data-purpose=go-to-next]",
    playPrev: "[data-purpose=go-to-previous]",
    mute: "[data-purpose=volume-control-button]",
    playState: ".vjs-playing",
    buttonSwitch: true,
    media: ".vjs-tech"
  });
})();
