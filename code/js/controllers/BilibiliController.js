"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "bilibili",
    playPause: ".bpx-player-ctrl-play",
    playNext: ".bpx-player-ctrl-next",
    playPrev: ".bpx-player-ctrl-prev",
    playState: ".bpx-player-container:not(.bpx-state-paused)",
    artist: ".up-name",
    like: ".video-like",
    song: ".title-text"
  });
})();
