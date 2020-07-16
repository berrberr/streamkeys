"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Yandex",
    playPause: ".player-controls__btn_play",
    playNext: ".player-controls__btn_next",
    playPrev: ".player-controls__btn_prev",
    mute: ".volume__icon",
    like: ".player-controls .icon_like",
    dislike: ".player-controls .icon_like_on",

    song: ".player-controls .track__title",
    artist: ".player-controls .track__artists"
  });
})();
