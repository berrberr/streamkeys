"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Jango",
    playPause: "#player_pp",
    playNext: "#player_skip",
    like: "#player_thumbs_up",
    confirmLike: "#thumbs_updown_form_submit > input",
    dislike: "#player_thumbs_down",
    confirmDislike: "#thumbs_updown_form_submit > input",

    playState: "#player_pp.pause",
    song: "#player_info > div",
    artist: "#player_info > div + a"
  });
})();
