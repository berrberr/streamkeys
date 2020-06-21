"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Jamendo Music",
    playPause: ".player-controls_play",
    playNext: ".player-controls_next",
    playPrev: ".player-controls_previous",
    mute: ".player-volume_mute",
    like: "ul.player-mini_track-actions li:first-child > button:not(.is-on)",
    dislike: "ul.player-mini_track-actions li:first-child > button.is-on",

    playState: ".player-controls.is-play",
    song: ".player-mini_track_information_title",
    artist: ".player-mini_track_information_artist",

    hidePlayer: true
  });
})();
