;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: ".btn-playPause",
    playNext: ".btn-skip",
    playPrev: ".btn-rewind",
    mute: ".btn-volume"
  });
})();
