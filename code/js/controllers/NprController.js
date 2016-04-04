;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "NPR One",
    play: "toggle-play",
    pause: "toggle-play",
    playNext: "skip",

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
