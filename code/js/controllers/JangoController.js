;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Jango",
    playPause: "#btn-playpause",
    playNext: "#btn-ff",
    like: "#btn-fav",
    dislike: "#player_ban",

    playState: "#btn-playpause.pause",
    song: "#current-song",
    artist: "#player_current_artist > a"
  });
})();
