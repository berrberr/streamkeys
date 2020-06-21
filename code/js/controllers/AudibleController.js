"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Audible",

    play: "#adbl-cloud-player-controls .adblPlayButton",
    pause: "#adbl-cloud-player-controls .adblPauseButton",
    playPrev: "#adbl-cloud-player-controls .adblFastRewind",
    playNext: "#adbl-cloud-player-controls .adblFastForward",
    buttonSwitch: false,
    song: "#cp-Top-chapter-display",
    art: "#adbl-cloudBook",

    playState: ".adblPlayButton.bc-hidden"
  });

  controller.isPlaying = function() {
    var playEl = this.doc().querySelector(this.selectors.play),
      isPlaying = false;

    if(this.buttonSwitch) {
      // If playEl does not exist then it is currently playing
      isPlaying = (playEl === null);
    }
    else if(this.selectors.playState) {
      // Check if the play state element exists and is visible
      var playStateEl = this.doc().querySelector(this.selectors.playState);
      // Override the second check here since it fails even though it shouldn't
      isPlaying = !!(playStateEl);
    }
    else if(playEl) {
      isPlaying = (window.getComputedStyle(playEl, null).getPropertyValue("display") === "none");
    }
    return isPlaying;
  };

})();
