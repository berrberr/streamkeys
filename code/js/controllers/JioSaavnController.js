;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "JioSaavn",
    play: "#play",
    pause: "#pause",
    playNext: "#fwd",
    playPrev: "#rew",
    mute: "#mute",

    song: "#player-track-name",
    album: "#player-album-name"
  });
})();
