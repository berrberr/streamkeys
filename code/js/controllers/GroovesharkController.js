;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "#play-pause",
    playNext: "#play-next",
    playPrev: "#play-prev",
    mute: "#volume",
    like: "#np-fav",

    playState: ".player-btn.playing",
    pauseState: ".player-btn.paused",

    song: "a[data-tooltip-cache-key=playerSong]",
    artist: "a[data-tooltip-cache-key=playerArtist]"
  });
})();
