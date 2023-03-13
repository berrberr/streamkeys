"use strict";
(function() {
  var BaseController = require("BaseController");

  var blockSelectors = {
    block: "[data-test=play-controls] > [data-test=block]",
    blockTrack: "[data-test=block-track]"
  };

  var controller = new BaseController({
    siteName: "Tidal",
    play: "[data-test=play]",
    pause: "[data-test=pause]",
    playNext: "[data-test=next]",
    playPrev: "[data-test=previous]",
    dislike: "[data-test=block]",

    song: "[data-test=track-title]",
    artist: "[data-test=artist-title]",
    buttonSwitch : true
  });

  controller.dislike = function() {
    if(!document.querySelector(blockSelectors.blockTrack)) {
      document.querySelector(blockSelectors.block).click();
    }
    document.querySelector(blockSelectors.blockTrack).click();
  };
})();
