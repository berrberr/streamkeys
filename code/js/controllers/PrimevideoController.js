;(function() {
  "use strict";

  /*global PointerEvent */

  var BaseController = require("BaseController"),
  sk_log = require("../modules/SKLog.js");

  var controller = new BaseController({
    siteName: "Amazon Prime Video",
    playPause: ".pausedOverlay",
    playState: ".overlaysContainer .pausedIcon",
    playNext: ".overlaysContainer .fastSeekForward",
    playPrev: ".overlaysContainer .fastSeekBack",
    song: ".topPanel .contentTitlePanel .title"
  });

/**
 * Prime Video does not use button clicks, rather, it uses pointer events to handle both mouse and
 * touch events simultaneously.
 */
  controller.playPause = function() {
    try {
      const element = this.doc().querySelector(this.selectors.playPause);

      // Player is always loaded in the background and video will start playing in the background if allowed.
      // Hence, need to prevent from playing the video if the player is hidden
      if (window.getComputedStyle(element, null).getPropertyValue("display") === "none") {
        return;
      }

      element.dispatchEvent(new PointerEvent("pointerup"));
      sk_log("playPause");
    } catch(e) {
      sk_log("Element not found for click.", this.selectors.playPause, true);
    }

    // Update the player state after a click
    this.updatePlayerState();
  };
})();
