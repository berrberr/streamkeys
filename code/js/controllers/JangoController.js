;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "#btn-playpause",
    playNext: "#btn-ff",
    mute: "#player_volume_icon",
    iframe: "[name=content]",
    like: "#player_fav_icon",
    dislike: "#player_ban_icon"
  });
})();
