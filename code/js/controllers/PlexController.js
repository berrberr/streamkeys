"use strict";
(function() {
  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Plex.tv",
    play: "div[class^=ControlsContainer] button[data-qa-id=resumeButton], div[class^=ControlsContainer] button[data-testid=resumeButton]",
    pause: "div[class^=ControlsContainer] button[data-qa-id=pauseButton], div[class^=ControlsContainer] button[data-testid=pauseButton]",
    playNext: "div[class^=ControlsContainer] button[data-qa-id=nextButton], div[class^=ControlsContainer] button[data-testid=nextButton]",
    playPrev: "div[class^=ControlsContainer] button[data-qa-id=previousButton], div[class^=ControlsContainer] button[data-testid=previousButton]",
    mute: "div[class^=ControlsContainer] button[data-qa-id=volumeButton], div[class^=ControlsContainer] button[data-testid=volumeButton]",

    song: "title",
    buttonSwitch: true
  });

  controller.click = function(opts) {
    this.mousedown({ selectorButton: opts.selectorButton });
    this.mouseup({ selectorButton: opts.selectorButton });
  };
})();
