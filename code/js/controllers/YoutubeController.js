"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "YouTube",
    playPause: ".ytp-play-button",
    playNext: ".ytp-next-button",
    playPrev: ".ytp-prev-button",
    mute: ".ytp-mute-button",
    like: "#menu > ytd-menu-renderer > #top-level-buttons > ytd-toggle-button-renderer:nth-child(1)",
    dislike: "#menu > ytd-menu-renderer > #top-level-buttons > ytd-toggle-button-renderer:nth-child(2)",

    playState: ".ytp-play-button[title^='Pause']",
    song: ".title.ytd-video-primary-info-renderer",
    album: "#playlist .title",
    hidePlayer: true,

    currentTime: ".ytp-time-current",
    totalTime: ".ytp-time-duration"
  });

  controller.getArtData = function() {
    var params = (new URL(controller.doc().location)).searchParams;

    var vid = params.get("v");
    if (vid !== null) {
      return "https://img.youtube.com/vi/" + vid + "/default.jpg";
    }
    return null;
  };

})();
