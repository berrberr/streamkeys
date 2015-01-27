;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Myspace",
    playPause: ".play",
    playNext: ".next",
    playPrev: ".previous",
    mute: "#volumeBtn",

    playState: "[data-original-title=Pause]",
    song: ".track > .title > a",
    artist: ".track > .artist > a"
  });
})();
