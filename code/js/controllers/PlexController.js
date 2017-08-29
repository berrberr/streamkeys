;(function() {
  "use strict";

  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Plex.tv",
    play: "i[class^=plex-icon-player-play-]",
    pause: "i[class^=plex-icon-player-pause-]",
    playNext: "i[class^=plex-icon-player-next-]",
    playPrev: "i[class^=plex-icon-player-prev-]",
    mute: "i[class^=plex-icon-player-volume-]",

    song: "title",
    buttonSwitch: true
  });

  controller.click = function(opts) {
    this.mousedown({ selectorButton: opts.selectorButton });
    this.mouseup({ selectorButton: opts.selectorButton });
  };
})();
