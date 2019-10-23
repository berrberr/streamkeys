;(function() {
  "use strict";

  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Hulu",
    play: "div.controls__playback-button-playing",
    pause: "div.controls__playback-button-paused",
    playNext: "div.controls__fastforward-button",
    playPrev: "div.controls__rewind-button",
    mute: "div.controls__volume-button-mute",

    song: ".metadata-area__third-line",
    artist: ".metadata-area__second-line",
    art: ".end-card__replay-thumbnail",
    currentTime: ".controls__time-elapsed",
    totalTime: ".controls__time-duration",

    buttonSwitch: false
  });

  controller.isPlaying = function () {
    return !!(this.doc().querySelector("div.controls__playback-button--playing"));
  };
})();
