;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "YouTube",
    playPause: ".ytp-play-button",
    playNext: ".ytp-next-button",
    playPrev: ".ytp-prev-button",
    mute: ".ytp-mute-button",
    like: "#menu > ytd-menu-renderer > #top-level-buttons > ytd-toggle-button-renderer:nth-child(1)",
    dislike: "#menu > ytd-menu-renderer > #top-level-buttons > ytd-toggle-button-renderer:nth-child(2)",

    playState: ".ytp-play-button[aria-label='Pause']",
    song: ".title",

    hidePlayer: true
  });
})();
