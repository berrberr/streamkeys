;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Rainwave",
    playPause: "#audio_status_play",

    playState: ".playing",
    song: ".timeline_now_playing_song .title",
    artist: ".timeline_now_playing_song .artist",
    album: ".timeline_now_playing_song .album"
  });
})();
