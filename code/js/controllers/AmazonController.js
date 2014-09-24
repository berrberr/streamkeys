;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "[playeraction='togglePlay']",
    playNext: "[playeraction='next']",
    playPrev: "[playeraction='previous']",
    mute: "#volumeIcon"
  });
})();
