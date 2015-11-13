;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Grooveshark",
    playPause: "#play-pause",
    playNext: "#play-next",
    playPrev: "#play-prev",
    mute: "#volume",
    like: "#np-fav",

    pauseState: ".player-btn.paused",
    playState: ".player-btn.playing",
    song: "a[data-tooltip-cache-key=playerSong]",
    artist: "a[data-tooltip-cache-key=playerArtist]"
  });
})();
