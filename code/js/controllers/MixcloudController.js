"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Mixcloud",
    play: ".player-open [aria-label='Play']",
    pause: ".player-open [aria-label='Pause']",
    buttonSwitch: true,
    like: ".player-icons.favorite:not(.favorite-state)",
    dislike: ".player-icons.favorite.favorite-state",
    overridePlayNext: true,
    overridePlayPrev: true,

    playState: ".player-control.pause-state",
    song: ".player-cloudcast-title",
    artist: ".player-cloudcast-author-link"
  });

  controller.playNext = function() {
    this.doc().querySelector("audio").currentTime += 30;
  };
  controller.playPrev = function() {
    this.doc().querySelector("audio").currentTime -= 30;
  };
})();
