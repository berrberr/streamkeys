;(function() {
  "use strict";

  var controller = require("BaseController"),
      sk_log = require("../modules/SKLog.js"),
      $ = require("jquery");

  var multiSelectors = {
    play: [".ytp-button-play", null],
    pause: [".ytp-button-pause", null],
    playNext: [".ytp-button-next", ".ytp-next-button"],
    playPrev: [".ytp-button-prev", ".ytp-prev-button"],
    playState: [".ytp-button-pause", ".ytp-play-button[aria-label='Pause']"]
  };

  controller.init({
    siteName: "YouTube",
    play: ".ytp-button-play",
    pause: ".ytp-button-pause",
    playNext: ".ytp-button-next",
    playPrev: ".ytp-button-prev",
    mute: ".ytp-button-volume",
    like: ".like-button-renderer-like-button",
    dislike: ".like-button-renderer-dislike-button",

    playState: ".ytp-button-pause",
    song: ".watch-title",
    buttonSwitch: true,
    hidePlayer: true
  });

  controller.checkPlayer = function() {
    var that = this;

    if(document.querySelector(multiSelectors.play[0]) || document.querySelector(multiSelectors.pause[0])) {
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[0];
      });
      that.buttonSwitch = true;
    } else {
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[1];
      });
      that.buttonSwitch = false;
    }
  };

  controller.playNext = function() {
    if(document.querySelector(this.selectors.playNext) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click({selectorButton: this.selectors.playNext, action: "playNext"});
  };

  controller.playPrev = function() {
    if(document.querySelector(this.selectors.playPrev) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click({selectorButton: this.selectors.playPrev, action: "playPrev"});
  };

})();
