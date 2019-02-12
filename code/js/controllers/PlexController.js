;(function() {
  "use strict";

  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Plex.tv",
    play: "button[aria-label='Play']",
    pause: "button[aria-label='Pause']",
    playNext: "button[aria-label='Next']",
    playPrev: "button[aria-label='Previous']",
    mute: "button[aria-label$='ute Volume']",

    song: "title",
    buttonSwitch: true
  });

  controller.click = function(opts) {
    this.mousedown({ selectorButton: opts.selectorButton });
    this.mouseup({ selectorButton: opts.selectorButton });
  };
})();
