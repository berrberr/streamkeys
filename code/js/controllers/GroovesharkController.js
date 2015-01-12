;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Grooveshark",

    playPause: "#play-pause",
    playNext: "#play-next",
    playPrev: "#play-prev",
    mute: "#volume",
    like: "#np-fav",

    playState: ".player-btn.playing",
    pauseState: ".player-btn.paused",

    songChange: "#now-playing-metadata",
    song: "a[data-tooltip-cache-key=playerSong]",
    artist: "a[data-tooltip-cache-key=playerArtist]"
  });
})();
