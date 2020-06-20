"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "iBroadcast",
    play: ".mgr-player-controls .mgr-player-play",
    pause: ".mgr-player-controls .mgr-player-play",
    playPrev: ".mgr-player-controls .mgr-player-prev",
    playNext: ".mgr-player-controls .mgr-player-next",

    buttonSwitch: ".mgr-player-controls .mgr-player-play[src='/svg/btn-play.svg']",
    song: ".mgr-player-trackinfo .mgr-player-title",
    artist: ".mgr-player-trackinfo .mgr-player-artist",
    album: ".mgr-player-trackinfo .mgr-player-album"
  });
})();
