;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "[data-player=play-pause]",
    playNext: "[data-player=next]",
    playPrev: "[data-player=previous]",
    mute: ".vol-icon-wrapper",
    like: "[data-song=toggle-favorite]"
  });
})();
