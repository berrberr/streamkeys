;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Rhapsody",
    play: ".player-play-button .icon-play",
    pause: ".player-play-button .icon-pause",
    playNext: ".player-advance-button",
    playPrev: ".player-rewind-button",
    like: ".favorite-button",
    dislike: ".favorite-button.active",

    playState: ".player-play-button .icon-pause",
    song: ".player-track",
    artist: ".player-artist"
  });
})();
