(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "iHeartRadio",
    play: ".player-controls .icon-play",
    pause: ".player-controls .icon-pause",
    playNext: ".player-controls .icon-skip",
    mute: ".player-controls .icon-volume",
    like: ".player-controls .icon-thumb-up-unfilled",
    dislike: ".player-controls .icon-thumb-down-unfilled",

    playState: ".player-controls .icon-pause",
    song: "a.player-song",
    artist: "a.player-artist"
  });
})();
