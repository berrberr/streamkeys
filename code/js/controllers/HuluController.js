;(function() {
  "use strict";

  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Hulu",
    play: "div.controls__playback-button-playing",
    pause: "div.controls__playback-button-paused",
    playNext: "div.controls__fastforward-button",
    playPrev: "div.controls__rewind-button",
    mute: "div.controls__volume-button-mute'e",

    song: ".metadata-area__third-line",
    buttonSwitch: false
  });

  controller.isPlaying = function () {
    return !!(this.doc().querySelector("div.controls__playback-button--playing"));
  };
})();
