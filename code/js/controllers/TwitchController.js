;(function() {
  "use strict";

  var controller = require("BaseController");

  controller.init({
    siteName: "Twitch.tv",
    playPause: ".player-button--playpause",
    song: ".title .real"
  });

  controller.isPlaying = function() {
    return !!(this.doc().querySelector("span[data-tip='Pause']"));
  };

})();
