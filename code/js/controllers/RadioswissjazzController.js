;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "RadioSwissJazz",
    playPause: "[role=play]",
    play: "[role=play]",
    pause: "[role=stop]",

    song: ".current-airplay .titletag",
    artist: ".current-airplay .artist"
  });
})();
