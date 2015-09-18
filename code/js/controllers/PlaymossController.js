;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Playmoss",
    play: "#controller .play",
    pause: "#controller .pause",
    playNext: "#controller .next",
    playPrev: "#controller .prev",

    song: ".track.playing a"
  });
})();
