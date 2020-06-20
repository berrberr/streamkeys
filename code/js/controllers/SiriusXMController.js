"use strict";
(function () {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "SiriusXM",
    playPause: ".play-pause-btn",
    playNext: ".skip-forward-btn",
    playPrev: ".skip-back-btn",
    mute: ".mute-btn",

    playState: ".play-pause-btn__img[alt='Pause']",
    song: ".track-name",
    album: ".artist-name", //"Show" name
    art: ".channel-image"
  });
})();
