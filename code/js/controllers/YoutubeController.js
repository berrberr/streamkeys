;(function() {
  "use strict";

  var controller = require("BaseController"),
      sk_log = require("../modules/sk_log.js");

  controller.init({
    playPause: ".ytp-button-play",
    play: ".ytp-button-play",
    pause: ".ytp-button-pause",
    playNext: ".next-playlist-list-item",
    playPrev: ".prev-playlist-list-item",
    mute: ".ytp-button-volume",
    buttonSwitch: true
  });

  controller.playNext = function() {
    if(document.querySelector(this.selector_playNext) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click(this.selector_playNext, "playNext");
  };

  controller.playPrev = function() {
    if(document.querySelector(this.selector_playPrev) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click(this.selector_playPrev, "playPrev");
  };
})();
