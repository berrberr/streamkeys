;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Di.fm",
    playPause: "#ctl-play",
    mute: "#btn-volume",
    like: "#main-container .vote-btn.up",
    dislike: "#main-container .vote-btn.down",

    playState: ".icon-stop",
    song: "div.title-container > div.title"
  });
})();
