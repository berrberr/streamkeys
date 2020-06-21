"use strict";
(function() {
  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Plex.tv",
    play: "div[class^=ControlsContainer] button[data-qa-id=resumeButton]",
    pause: "div[class^=ControlsContainer] button[data-qa-id=pauseButton]",
    playNext: "div[class^=ControlsContainer] button[data-qa-id=nextButton]",
    playPrev: "div[class^=ControlsContainer] button[data-qa-id=previousButton]",
    mute: "div[class^=ControlsContainer] button[data-qa-id=volumeButton]",

    song: "title",
    buttonSwitch: true
  });

  controller.click = function(opts) {
    this.mousedown({ selectorButton: opts.selectorButton });
    this.mouseup({ selectorButton: opts.selectorButton });
  };
})();
