;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Twitch.tv",
    playPause: ".qa-pause-play-button",
    mute: ".player-button--volume",
    song: ".title .real",
    video: "video",
    canSeek: false // since livestream
  });

  controller.isPlaying = function() {
    return !!(this.doc().querySelector("span[data-tip='Pause']"));
  };

})();
