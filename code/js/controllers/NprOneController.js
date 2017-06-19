(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "NPR One Player",
    play: "toggle-play .player__play-control",
    pause: "toggle-play .player__play-control",
    playNext: "skip  .player__play-control",

    playState: "i.player__play-control__icon--pause",
    song: "h1.card__title",

    hidePlayer: true
  });

  controller.isPlaying = function() {
    var playStateEl = document.querySelector(this.selectors.playState);
    return (playStateEl &&
      window.getComputedStyle(playStateEl, null).getPropertyValue("display") !== "none");
  };
})();
