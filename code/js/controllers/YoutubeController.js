;(function() {
  "use strict";

  var controller = require("BaseController"),
      sk_log = require("../modules/sk_log.js");

  controller.init({
    playPause: ".ytp-button-play",
    play: ".ytp-button-play",
    pause: ".ytp-button-pause",
    playNext: ".ytp-button-next",
    playPrev: ".ytp-button-prev",
    mute: ".ytp-button-volume",
    like: "#watch-like",
    dislike: "#watch-dislike",
    buttonSwitch: true
  });

  controller.playNext = function() {
    if(document.querySelector(this.selector_playNext) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click({selectorButton: this.selector_playNext, action: "playNext"});
  };

  controller.playPrev = function() {
    if(document.querySelector(this.selector_playPrev) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click({selectorButton: this.selector_playPrev, action: "playPrev"});
  };
})();
