"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Spotify",
    play: ".now-playing-bar button[class*=play]",
    pause: ".now-playing-bar button[class*=pause]",
    playNext: ".now-playing-bar button[class*=skip-forward]",
    playPrev: ".now-playing-bar button[class*=skip-back]",
    like: ".now-playing-bar button[class*=heart]",
    dislike: ".now-playing-bar button[class*=block]",
    buttonSwitch: true,
    mute: ".now-playing-bar button[class*=volume]",
    song: ".now-playing-bar .track-info__name",
    artist: ".now-playing-bar .track-info__artists",
    art: ".now-playing-bar .cover-art-image-loaded",

    // Messy nth-child selectors, but there is no other class/id/attribute information to distinguish the two times
    currentTime: ".now-playing-bar .playback-bar__progress-time:nth-child(1)",
    totalTime: ".now-playing-bar .playback-bar__progress-time:nth-child(3)"
  });

  // Spotify art uses an inline CSS background-image style, this override parses the image from there
  controller.getArtData = function(selector) {
    if (!selector) return null;

    var dataEl = this.doc().querySelector(selector);

    if (dataEl !== null) {
      var backgroundImage = window.getComputedStyle(dataEl)["background-image"];
      return backgroundImage.match(/url\(["|']?([^"']*)["|']?\)/)[1];
    }
  };
})();
