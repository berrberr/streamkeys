; (function () {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "music2me",
    playPause: "#vjs-player > div.vjs-control-bar > div.vjs-control-bar-left > button.vjs-play-control.vjs-control.vjs-button",
    playNext: "button.vjs-button-nextlesson",
    playPrev: "i.fas.fa-step-backward",
    playState: ".vjs-playing",
    mute: ".vjs-mute-control",
    // currentTime: ".vjs-current-time-display",
    // totalTime: ".vjs-duration-display",
    artist: "body > nav > div.is-left > ul > li:nth-child(3) > a",
    song: ".info-title",
    buttonSwitch: true,
    hidePlayer: true,
    media: "#vjs-player_html5_api"
  });

  controller.playPause = function () {
    if (this.selectors.playPause !== null) {
      // if the video-view is not open -> open it and play video by clicking the thumbnail button
      if (document.querySelector(".has-videofullscreen") == null) {
        this.click({ action: "playPause", selectorButton: ".thumbnail[data-tutorial-onclick]", selectorFrame: this.selectors.iframe });
      } else {
        this.click({ action: "playPause", selectorButton: this.selectors.playPause, selectorFrame: this.selectors.iframe });
      }
    }
  };

})();
