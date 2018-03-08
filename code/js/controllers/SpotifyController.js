;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Spotify",
    play: ".now-playing-bar button[class*=play]",
    pause: ".now-playing-bar button[class*=pause]",
    playNext: ".now-playing-bar button[class*=skip-forward]",
    playPrev: ".now-playing-bar button[class*=skip-back]",
    like: ".now-playing button",
    dislike: ".now-playing-bar button[class*=thumbs-down]",
    buttonSwitch: true,
    mute: ".now-playing-bar button[class*=volume]",
    song: ".now-playing-bar .track-info__name",
    artist: ".now-playing-bar .track-info__artists",
    art: "div.now-playing-bar__left div.cover-art-image.cover-art-image-loaded"
  });

  // Spotify art uses an inline CSS background-image style, this override parses the image from there
  controller.getArtData = function(selector) {
    if(!selector) return null;

    var dataEl = this.doc().querySelector(selector);

    if (dataEl !== null)
    {
      var backgroundImage = window.getComputedStyle(dataEl)["background-image"];
      return backgroundImage.match(/url\(["|']?([^"']*)["|']?\)/)[1];
    }
  };
})();
