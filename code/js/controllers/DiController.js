;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "#ctl-play",
    mute: "#btn-volume",
    like: "#main-container .vote-btn.up",
    dislike: "#main-container .vote-btn.down"
  });
})();
