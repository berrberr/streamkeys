"use strict";
(function() {
  var MouseEventController = require("MouseEventController");
  var yandexRadioController = new MouseEventController({
    siteName: "Yandex Radio",

    playPause: ".player-controls__play",
    playNext: ".slider__item_next",
    playState: ".body_state_playing",

    mute: ".volume__btn",
    like: ".player-controls .like_action_like",
    dislike: ".player-controls .like_action_dislike",

    song: ".player-controls__title",
    artist: ".player-controls__artists"
  });

  // override mute
  yandexRadioController.mute = function() {
    this.mousedown({action: "mute", selectorButton: this.selectors.mute, selectorFrame: this.selectors.iframe});
  };
})();
