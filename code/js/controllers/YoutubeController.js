;(function() {
  "use strict";

  var controller = require("BaseController"),
      sk_log = require("../modules/SKLog.js");

  controller.init({
    siteName: "YouTube",
    playPause: ".ytp-button-play",
    play: ".ytp-button-play",
    pause: ".ytp-button-pause",
    playNext: ".ytp-button-next",
    playPrev: ".ytp-button-prev",
    mute: ".ytp-button-volume",
    like: "#watch-like",
    dislike: "#watch-dislike",

    playState: ".ytp-button-pause",
    pauseState: ".ytp-button-pause",
    songChange: ".watch-title",
    song: ".watch-title",
    buttonSwitch: true
  });

  controller.playNext = function() {
    if(document.querySelector(this.selectors.playNext) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click({selectorButton: this.selectors.playNext, action: "playNext"});
  };

  controller.playPrev = function() {
    if(document.querySelector(this.selectors.playPrev) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click({selectorButton: this.selectors.playPrev, action: "playPrev"});
  };
})();
