(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Audiosplitter",
    play: ".p-controls .as-icon-play",
    pause: ".p-controls .as-icon-pause",
    playNext: ".p-controls .as-icon-forward",
    playPrev: ".p-controls .as-icon-backward",

    song: ".p-title",
    artist: ".p-artist"
  });
})();
