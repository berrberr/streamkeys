;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "[data-action=play-pause]",
    playNext: "[data-action=next]",
    playPrev: "[data-action=previous]",
    like: "[data-action=toggle-favorite]"
  });
})();
