"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Apple Music",
    play: "div.web-chrome-playback-controls__main > button:nth-child(2)",
    pause: "div.web-chrome-playback-controls__main > button:nth-child(2)",
    playNext: "div.web-chrome-playback-controls__main > button:nth-child(3)",
    playPrev:
      "div.web-chrome-playback-controls__main > button.button-reset.web-chrome-playback-controls__playback-btn.web-chrome-playback-controls__playback-btn--previous",

    playState: "body > div.web-navigation > div > div.web-chrome.is-playing",
    song: "#playback-sub-copy > div > div > span:nth-child(1) > span",
    buttonSwitch: true
  });
})();
