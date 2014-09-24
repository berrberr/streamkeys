;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "[data-id=play-pause]",
    playNext: "[data-id=forward]",
    playPrev: "[data-id=rewind]"
  });
})();
