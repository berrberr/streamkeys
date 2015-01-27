;(function() {
  "use strict";

  var controller = require("BaseController");

  controller.init({
    siteName: "Saavn",
    playPause: "#play",
    play: "#play",
    pause: "#pause",
    playNext: "#fwd",
    playPrev: "#rew",
    mute: "#mute",

    song: "#player-track-name",
    album: "#player-album-name"
  });
})();
