"use strict";
(function() {
  const BaseController = require("BaseController");

  const telegramController = new BaseController({
    siteName: "Telegram Web",
    playPause: ".header-player button:nth-child(2)",
    playNext: ".header-player button:nth-child(3)",
    playPrev: ".header-player button:nth-child(1)",
    mute: ".header-player .header-player-content + div > button",

    currentTime: ".ytp-time-current",
    song: ".header-player-title"
  });

  telegramController.isPlaying = function() {
    const playPauseBtn = this.doc().querySelector(this.selectors.playPause);

    return playPauseBtn
      ? playPauseBtn.querySelector("path").getAttribute("transform").includes("-15")
      : false;
  };

})();
