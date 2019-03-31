;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Player.fm",
    play: ".fa-play",
    pause: ".fa-pause",
    playNext: ".fa-fast-forward",
    playPrev: ".fa-fast-backward",

    song: ".current-episode-link"
  });
})();
