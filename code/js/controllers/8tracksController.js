"use strict";
(function() {
  var BaseController = require("BaseController");
  var playNextOptions = ["#player_skip_button", "#next_mix_button"];

  new BaseController({
    siteName: "8tracks",
    play: "#player_play_button",
    pause: "#player_pause_button",
    playNext: function() {
      for (var i = 0; i < playNextOptions.length; i++) {
        var el = this.doc().querySelector(playNextOptions[i]);
        if (el && el.style.display !== "none") {
          return playNextOptions[i];
        }
      }
      // None are valid, just return the first selector
      return playNextOptions[0];
    },
    mute: ".volume-mute",
    like: ".mix-like.inactive",
    dislike: ".mix-like.active",

    song: "li.track.now_playing div.title_container div.title_artist span.t",
    artist: "li.track.now_playing div.title_container div.title_artist span.a"
  });
})();
