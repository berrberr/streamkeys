(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Rhapsody",
    play: ".player-play-button .icon-play-button",
    pause: ".player-play-button .icon-pause2",
    playNext: ".player-advance-button",
    playPrev: ".player-rewind-button",
    like: ".favorite-button",
    dislike: ".favorite-button.active",

    playState: ".player-play-button .icon-pause2",
    song: ".player-track",
    artist: ".player-artist"
  });
})();
