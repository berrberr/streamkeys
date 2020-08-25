"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Tidal",
    play: "[data-test=play]",
    pause: "[data-test=pause]",
    playNext: "[data-test=next]",
    playPrev: "[data-test=previous]",
    block: "[data-test=block]",
    blockTrack: "[data-test=block-track]",
    dislike: "#override",

    song: "[data-test=track-title]",
    artist: "[data-test=artist-title]",
    buttonSwitch : true
  });

  controller.dislike = function() {
    if(!document.querySelector(this.selectors.blockTrack)) {
      document.querySelector(this.selectors.block).click();
    }
    document.querySelector(this.selectors.blockTrack).click();
  };
})();
