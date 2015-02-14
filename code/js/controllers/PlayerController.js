;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Player.fm",
    playPause: ".control.play",
    play: ".control.play",
    pause: ".control.pause",
    playNext: ".control.forward",
    playPrev: ".control.backward",

    song: ".current-episode-link"
  });
})();
