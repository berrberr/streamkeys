;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "RadioSwissJazz",
    playPause: "[role=play]",
    play: "[role=play]",
    pause: "[role=stop]",

    playState: ".jp-state-playing",
    song: ".current-airplay .titletag",
    artist: ".current-airplay .artist"
  });
})();
