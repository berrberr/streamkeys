"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Drive Player",

    play: ".jp-controls .jp-play",
    pause: ".jp-controls .jp-pause",
    playNext: ".jp-controls .jp-next",
    playPrev: ".jp-controls .jp-previous",
    mute: ".jp-controls .jp-mute",

    playState: ".jp-controls .jp-pause[style=\"display: block;\"]",
    artist: ".song.playing .artist",
    song: ".song.playing .title",

  });
})();
