;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "8tracks",
    playPause: "#player_play_button",
    play: "#player_play_button",
    pause: "#player_pause_button",
    playNext: "#player_skip_button",
    mute: ".volume-mute",
    like: ".mix-like.inactive",
    dislike: ".mix-like.active",

    song: "li.track.now_playing div.title_container div.title_artist span.t",
    artist: "li.track.now_playing div.title_container div.title_artist span.a"
  });
})();
