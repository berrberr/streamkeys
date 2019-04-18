;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Synology Audio Station",
    playPause: ".player-play button[class*=btn]",
    playNext: ".player-next button[class*=btn]",
    playPrev: ".player-prev button[class*=btn]",
    mute: ".player-volume button[class*=btn]",
    song: ".info-title > span",
    artist: ".info-album-artist > span",
    art: ".player-info-thumb",
    currentTime: ".info-position",
    totalTime: ".info-duration"
  });
})();
