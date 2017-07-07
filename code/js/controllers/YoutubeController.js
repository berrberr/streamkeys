(function() {
  "use strict";

  var BaseController = require("BaseController"),
    sk_log = require("../modules/SKLog.js"),
    _ = require("lodash");

  var multiSelectors = {
    play: [".ytp-button-play", null],
    pause: [".ytp-button-pause", null],
    playPause: [".ytp-button-play", ".ytp-play-button"],
    playNext: [".ytp-button-next", ".ytp-next-button"],
    playPrev: [".ytp-button-prev", ".ytp-prev-button"],
    playState: [".ytp-button-pause", ".ytp-play-button[aria-label='Pause']"],
    restart: [null, ".ytp-play-button[title='Replay']"]
  };

  chrome.storage.sync.get(function(obj) {
    var controller = new BaseController({
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

    // Override the playPause function
    controller.playPause = function() {
      // If the restart button exists check for the setting before clicking
      if (this.doc().querySelector(this.selectors.restart)) {
        if (obj["hotkey-youtube_restart"]) {
          this.click({
            action: "playPause",
            selectorButton: this.selectors.restart,
            selectorFrame: this.selectors.iframe
          });
        }
      } else {
        if (this.selectors.play !== null && this.selectors.pause !== null) {
          if (this.isPlaying()) {
            this.click({
              action: "playPause",
              selectorButton: this.selectors.pause,
              selectorFrame: this.selectors.iframe
            });
          } else {
            this.click({
              action: "playPause",
              selectorButton: this.selectors.play,
              selectorFrame: this.selectors.iframe
            });
          }
        } else {
          this.click({
            action: "playPause",
            selectorButton: this.selectors.playPause,
            selectorFrame: this.selectors.iframe
          });
        }
      }
    };

    controller.checkPlayer = function() {
      var that = this;

      if (document.querySelector(multiSelectors.play[0]) || document.querySelector(multiSelectors.pause[0])) {
        _.each(multiSelectors, function(value, key) {
          that.selectors[key] = value[0];
        });
        that.buttonSwitch = true;
      } else {
        _.each(multiSelectors, function(value, key) {
          that.selectors[key] = value[1];
        });
        that.buttonSwitch = false;
      }
    };

    controller.playNext = function() {
      if (document.querySelector(this.selectors.playNext) === null) sk_log("disabled. Playlist selectors not found!");
      else this.click({
        selectorButton: this.selectors.playNext,
        action: "playNext"
      });
    };

    controller.playPrev = function() {
      if (document.querySelector(this.selectors.playPrev) === null) sk_log("disabled. Playlist selectors not found!");
      else this.click({
        selectorButton: this.selectors.playPrev,
        action: "playPrev"
      });
    };
  });

})();
