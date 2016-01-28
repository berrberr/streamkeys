;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "TheSixtyOne",
    play: "#miniplayer_play_button",
    pause: "#miniplayer_pause_button",
    playNext: "#miniplayer_next_button",
    playPrev: "#miniplayer_prev_button",

    song: "#miniplayer_song_title",
    artist: "#miniplayer_artist_name"
  });
})();
