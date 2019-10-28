;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Twitch.tv",
    playPause: ".player-controls__left-control-group > .tw-inline-flex > .tw-align-items-center",
    song: ".title .real"
  });

  controller.isPlaying = function() {
    return !!(this.doc().querySelector("span[data-tip='Pause']"));
  };

})();
