"use strict";
(function () {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Primephonic",
    playPause: "#player-play-pause",
    playNext: "#player-next",
    playPrev: "#player-prev",
    mute: "#toggle-volume",

    playState: "#player-play-pause > img[title='Pause']",
    song: "#currently-playing-work",
    artist: "#currently-playing-composer",
  });
})();
