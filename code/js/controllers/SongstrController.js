;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Songstr",
    playPause: "#playing_control",

    playState: ".player_stop",
    song: "#playing_title",
    artist: "#playing_artist"
  });
})();
