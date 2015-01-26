;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Rainwave",
    playPause: "#audio_status_play",

    playState: ".playing",
    song: ".timeline_now_playing_song .title",
    artist: ".timeline_now_playing_song .artist",
    album: ".timeline_now_playing_song .album"
  });
})();
