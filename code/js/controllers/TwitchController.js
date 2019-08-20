(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Twitch.tv",
    playPause: ".qa-pause-play-button",
    song: ".title .real"
  });

  controller.isPlaying = function() {
    return !!this.doc().querySelector("span[data-tip='Pause']");
  };
})();
