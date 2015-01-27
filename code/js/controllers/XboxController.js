;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Xbox Music",
    playPause: ".iconPlayerPlay",
    play: ".iconPlayerPlay",
    pause: ".iconPlayerPause",
    playNext: ".iconPlayerNext",
    playPrev: ".iconPlayerPrevious",
    buttonSwitch: true,

    song: ".playerNowPlayingMetadata .primaryMetadata > a",
    artist: ".playerNowPlayingMetadata .secondaryMetadata > a"
  });
})();
