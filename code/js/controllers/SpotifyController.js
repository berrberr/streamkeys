;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Spotify",
    play: ".control-button.spoticon-play-16",
    pause: ".control-button.spoticon-pause-16",
    playNext: ".control-button.spoticon-skip-forward-16",
    playPrev: ".control-button.spoticon-skip-back-16",
    like: ".control-button.spoticon-thumbs-up-16",
    dislike: ".control-button.spoticon-thumbs-down-16",
    buttonSwitch: true,
    mute: ".volume-bar__icon",
    song: ".track-info__name",
    artist: ".track-info__artists"
  });
})();
