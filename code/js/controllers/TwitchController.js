;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Twitch.tv",
    playPause: "[data-a-target='player-play-pause-button']",
    song: "[data-a-target='stream-title']"
  });

  controller.isPlaying = function() {
    return this.doc().querySelector("[data-a-target='player-play-pause-button']").getAttribute("data-a-player-state") === "playing";
  };

})();
