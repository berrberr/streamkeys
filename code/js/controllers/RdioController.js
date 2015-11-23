;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Rdio",
    playPause: ".play_pause",
    playNext: ".next",
    playPrev: ".prev",
    mute: ".Volume",

    playState: ".play_pause.playing",
    song: ".text_metadata .song_title",
    artist: ".text_metadata .artist_title"
  });
})();
