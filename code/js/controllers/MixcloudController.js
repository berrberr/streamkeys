;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Mixcloud",
    playPause: "#react-root > div > section > div:nth-child(5) > div > div > div:first-child > div:first-child > div:first-child",
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
