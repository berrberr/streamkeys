;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Twitch.tv",
    playPause: ".player-button--playpause",
    song: ".title .real"
  });

  controller.isPlaying = function() {
    return !!(this.doc().querySelector("span[data-tip='Pause']"));
  };

})();
