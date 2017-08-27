;(function() {
  "use strict";

  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Plex.tv",
    play: "button[aria-label='Play'] > i",
    pause: "button[aria-label='Pause'] > i",
    playNext: "button[aria-label='Next'] > i",
    playPrev: "button[aria-label='Previous'] > i",
    mute: "button[aria-label='Mute Volume'] > i",

    song: "[class^=' MetadataPosterTitle-title'] [role=link]",
    buttonSwitch: true
  });

  controller.click = function(opts) {
    this.mousedown({ selectorButton: opts.selectorButton });
    this.mouseup({ selectorButton: opts.selectorButton });
  };
})();
