;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Jango",
    playPause: "#player_play",
    playNext: "#player_skip",
    like: "#player_thumbs_up",
    confirmLike: "#thumbs_updown_form_submit > input",
    dislike: "#player_thumbs_down",
    confirmDislike: "#thumbs_updown_form_submit > input",

    playState: "#player_play.player_pause",
    song: "#song_info > span",
    artist: "#album_info > span > a"
  });
})();
