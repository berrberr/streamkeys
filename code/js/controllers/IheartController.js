;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "iHeartRadio",
    play: ".player-controls .icon-play,button[data-test='play-button'] > [aria-labelledby='Play']",
    pause: ".player-controls .icon-pause,button[data-test='play-button'] > [aria-labelledby='Pause']",
    playNext: ".player-controls .icon-skip,button[data-test='skip-button']",
    mute: ".player-controls .icon-volume",
    like: ".player-controls .icon-thumb-up-unfilled",
    dislike: ".player-controls .icon-thumb-down-unfilled",

    playState: ".player-controls .icon-pause,button[data-test='play-button'] > [aria-labelledby='Pause']",
    song: "a.player-song,[data-test='mini-player-track-text'],[data-test='fullscreen-player-track-text']",
    artist: "a.player-artist,[data-test='mini-player-description-text'],[data-test='fullscreen-player-description-text']"
  });
})();
