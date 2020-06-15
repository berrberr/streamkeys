"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Microsoft Groove",
    play: ".iconPlayerPlay",
    pause: ".iconPlayerPause",
    playNext: ".iconPlayerNext",
    playPrev: ".iconPlayerPrevious",
    buttonSwitch: true,

    song: ".playerNowPlayingMetadata .primaryMetadata > a",
    artist: ".playerNowPlayingMetadata .secondaryMetadata > a"
  });
})();
