"use strict";
(function () {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Apple Music",

    // "fake" selectors used in getSongData()
    song: "song",
    artist: "artist",
    album: "album",

    buttonSwitch: true,
    overridePlayPause: true,
    overridePlayNext: true,
    overridePlayPrev: true
  });

  controller.isPlaying = function () {
    return !document.querySelector("amp-chrome-player")?.shadowRoot.querySelector("apple-music-playback-controls")?.shadowRoot.querySelector(".playback-play__pause")?.ariaHidden;
  };

  controller.playPause = function () {
    if (this.isPlaying()) {
      document.querySelector("amp-chrome-player")?.shadowRoot.querySelector("apple-music-playback-controls")?.shadowRoot.querySelector(".playback-play__pause")?.click();
    } else {
      document.querySelector("amp-chrome-player")?.shadowRoot.querySelector("apple-music-playback-controls")?.shadowRoot.querySelector(".playback-play__play")?.click();
    }
  };

  controller.playPrev = function () {
    document.querySelector("amp-chrome-player")?.shadowRoot.querySelector("apple-music-playback-controls")?.shadowRoot.querySelector(".previous")?.click()
  }

  controller.playNext = function () {
    document.querySelector("amp-chrome-player")?.shadowRoot.querySelector("apple-music-playback-controls")?.shadowRoot.querySelector(".next")?.click()
  }

  controller.getSongData = function (selector) {
    var r = null;
    if (selector == "song") {
      r = document.querySelector("amp-lcd")?.shadowRoot.querySelector(".lcd-meta__primary-wrapper .lcd-meta-line__fragment")?.textContent;
    } else if (selector == "artist") {
      r = document.querySelector("amp-lcd")?.shadowRoot.querySelector(".lcd-meta__secondary .lcd-meta-line__fragment:first-child")?.textContent;
    } else if (selector == "album") {
      r = document.querySelector("amp-lcd")?.shadowRoot.querySelector(".lcd-meta__secondary .lcd-meta-line__fragment:last-child")?.textContent;
    }
    return r ?? null;
  };
})();
