;(function() {
  "use strict";

  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Hulu",
    play: "div.play-pause-button",
    pause: "div.play-pause-button",
    playNext: "div.next-video-button",
    playPrev: "div.rewind-button",
    mute: "div.volume-image",

    song: ".pause-title",
    buttonSwitch: true
  });

  controller.isPlaying = function () {
    return !!(this.doc().querySelector("div.play-pause-button.playing"));
  };
})();
