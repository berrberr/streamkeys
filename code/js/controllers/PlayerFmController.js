;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Player.fm",
    play: ".control.play",
    pause: ".control.pause",
    playNext: ".control.fast-forward",
    playPrev: ".control.fast-backward",

    song: ".current-episode-link",
    artist: ".current-series-link",
    art: ".thumb > img"
  });
})();
