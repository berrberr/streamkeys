;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: ".playControl",
    playNext: ".skipControl__next",
    playPrev: ".skipControl__previous",
    mute: ".volume__togglemute",
  });
})();
