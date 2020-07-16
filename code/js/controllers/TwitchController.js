"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Twitch.tv",
    playPause: "[data-a-target='player-play-pause-button']",
    mute: ".player-button--volume",
    song: "[data-a-target='stream-title']",
    media: "video",
    canSeek: false // since livestream
  });

  controller.isPlaying = function() {
    var button = this.doc().querySelector("[data-a-target='player-play-pause-button']");
    return button && button.getAttribute("data-a-player-state") === "playing";
  };

})();
