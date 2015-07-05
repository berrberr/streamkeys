;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "NoiseSupply",
    playPause: ".player",
    playNext: ".skip",
    playState: ".fa-pause",
    song: ".title",
    artist: ".user"
  });
})();
