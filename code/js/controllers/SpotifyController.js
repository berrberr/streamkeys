"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Spotify",
    play: ".player-controls__buttons > button",
    pause: ".player-controls__buttons > button",
    playNext: ".player-controls__right button:nth-child(1)",
    playPrev: ".player-controls__left button:nth-child(2)",
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
