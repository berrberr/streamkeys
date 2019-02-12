;(function() {
  "use strict";

  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Plex.tv",
    play: "div[class^=ControlsContainer] button[aria-label=Play]",
    pause: "div[class^=ControlsContainer] button[aria-label=Pause]",
    playNext: "div[class^=ControlsContainer] button[aria-label=Next]",
    playPrev: "div[class^=ControlsContainer] button[aria-label=Previous]",
    mute: "div[class^=ControlsContainer] button[aria-label$='ute Volume']",

    song: "title",
    buttonSwitch: true
  });

  controller.click = function(opts) {
    this.mousedown({ selectorButton: opts.selectorButton });
    this.mouseup({ selectorButton: opts.selectorButton });
  };
})();
