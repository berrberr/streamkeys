;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Yandex Radio",
    playPause: ".player-controls__play",
    playNext: ".slider__item_next",
    mute: ".volume__btn",
    like: ".player-controls .like_action_like",
    dislike: ".player-controls .like_action_dislike",

    playState: ".body_state_playing",
    song: ".player-controls__title",
    artist: ".player-controls__artists"
  });
})();
