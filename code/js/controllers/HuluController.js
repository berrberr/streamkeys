"use strict";
(function() {
  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Hulu",
    play: "div.PlayButton",
    pause: "div.PauseButton",
    playNext: "div.UpNextButton",
    playPrev: "div[aria-label='START OVER']",
    mute: "div.VolumeControl.PlaybackControls__item :first-child",

    song: ".metadata-area__third-line",
    artist: ".metadata-area__second-line",
    art: ".end-card__replay-thumbnail",
    currentTime: ".Timestamp.Timeline__currentTimestamp",
    totalTime: ".Timestamp.Timeline__remainingTimestamp",

    buttonSwitch: false
  });

  controller.isPlaying = function () {
    return !!(this.doc().querySelector("div.controls__playback-button--playing"));
  };
})();

