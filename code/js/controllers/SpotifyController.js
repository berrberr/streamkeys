;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Spotify",
    play: ".now-playing-bar button[class*=play]",
    pause: ".now-playing-bar button[class*=pause]",
    playNext: ".now-playing-bar button[class*=skip-forward]",
    playPrev: ".now-playing-bar button[class*=skip-back]",
    like: ".now-playing-bar button[class*=thumbs-up]",
    dislike: ".now-playing-bar button[class*=thumbs-down]",
    buttonSwitch: true,
    mute: ".now-playing-bar button[class*=volume]",
    song: ".now-playing-bar .track-info__name",
    artist: ".now-playing-bar .track-info__artists"
  });
})();
