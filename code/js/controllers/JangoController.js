;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Jango",
    playPause: "#btn-playpause",
    playNext: "#btn-ff",
    mute: "#player_volume_icon",
    iframe: "[name=content]",
    like: "#player_fav_icon",
    dislike: "#player_ban_icon",

    playState: "#btn-playpause.pause",
    song: "#current-song",
    artist: "#player_current_artist > a"
  });
})();
