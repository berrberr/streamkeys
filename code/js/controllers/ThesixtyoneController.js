;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "TheSixtyOne",
    playPause: "#play_button",
    play: "#play_button",
    pause: "#pause_button",
    playNext: "#large_next_song_button",
    playPrev: "#large_previous_song_button",

    song: "#song_panel_title",
    artist: "#song_panel_artist"
  });
})();
