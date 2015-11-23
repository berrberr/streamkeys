;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "NPR",
    play: "a.play",
    pause: "a.pause",
    playNext: "a.next",

    playState: "a.pause",
    song: ".title",

    hidePlayer: true
  });

  controller.isPlaying = function() {
    var playStateEl = document.querySelector(this.selectors.playState);
    return (playStateEl &&
              window.getComputedStyle(playStateEl, null).getPropertyValue("display") !== "none");
  };
})();
