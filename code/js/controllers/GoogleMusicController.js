;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "[data-id=play-pause]",
    playNext: "[data-id=forward]",
    playPrev: "[data-id=rewind]",
    like: "[data-rating=5]",
    dislike: "[data-rating=1]"
  });
})();
