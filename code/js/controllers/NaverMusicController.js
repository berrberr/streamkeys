;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Naver Music",
    playPause: ".play.sp",
    playNext: ".next.sp",
    playPrev: ".prev.sp",
    mute: ".volume.sp",

    playState: ".play.sp.is_paused",
    song: ".info_song p:first-child span",
    artist: ".info_artist .name"
  });
})();
