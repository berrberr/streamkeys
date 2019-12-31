;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Jango",
    playPause: "#player_play",
    playNext: "#player_skip",
    like: "#player_thumbs_up",
    dislike: "#player_thumbs_down",

    playState: "#player_play.player_pause",
    song: "#song_info > span",
    artist: "#album_info > span > a"
  });
})();
