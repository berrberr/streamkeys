;(function() {
  "use strict";

  require("BaseController").init({
    playPause: ".playControl",
    playNext: ".skipControl__next",
    playPrev: ".skipControl__previous",
    mute: ".volumeVertical__togglemute",
  });
})();
