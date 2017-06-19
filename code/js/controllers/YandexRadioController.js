(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Yandex Radio",
    playPause: ".player-controls__play",
    playNext: ".slider__item:nth-child(4) .button.skip",
    mute: ".volume__btn",
    like: ".like_action_like",
    dislike: ".like_action_dislike",

    playState: ".body_state_playing",
    song: ".slider__item:nth-child(3) .track__title",
    artist: ".slider__item:nth-child(3) .track__artists"
  });
})();
