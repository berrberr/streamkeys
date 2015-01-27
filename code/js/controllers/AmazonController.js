;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Amazon Music",
    playPause: "[playeraction='togglePlay']",
    playNext: "[playeraction='next']",
    playPrev: "[playeraction='previous']",
    mute: "#volumeIcon"
  });
})();
