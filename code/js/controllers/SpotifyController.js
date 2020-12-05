"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Spotify",
    play: ".player-controls__buttons button:nth-child(3)",
    pause: ".player-controls__buttons button:nth-child(3)",
    playNext: ".player-controls__buttons button:nth-child(4)",
    playPrev: ".player-controls__buttons button:nth-child(2)",
    like: ".now-playing-bar div[class*=heart] button",
    dislike: ".now-playing-bar button[class*=block]",
    buttonSwitch: true,
    mute: ".now-playing-bar button[class*=volume]",
    song: ".now-playing div:nth-child(2) div:first-child span",
    artist: ".now-playing div:nth-child(2) div:last-child span",
    art: ".cover-art img",

    // Messy nth-child selectors, but there is no other class/id/attribute information to distinguish the two times
    currentTime: ".now-playing-bar .playback-bar__progress-time:nth-child(1)",
    totalTime: ".now-playing-bar .playback-bar__progress-time:nth-child(3)"
  });
})();
