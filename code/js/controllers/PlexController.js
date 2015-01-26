;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Plex.tv",
    playPause: "button.play-btn:not([tabindex='-1'])",
    play: "button.play-btn:not([tabindex='-1'])",
    pause: "button.pause-btn:not([tabindex='-1'])",
    playNext: "button.next-btn",
    playPrev: "button.previous-btn",
    mute: "button.volume-btn",

    song: ".video-title"
  });
})();
