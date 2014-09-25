;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "[data-player=play-pause]",
    playNext: "[data-player=next]",
    playPrev: "[data-player=previous]",
    mute: ".vol-icon-wrapper",
    like: "[data-song=toggle-favorite]"
  });
})();
