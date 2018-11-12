;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      sk_log = require("../modules/SKLog.js");

  var controller = new BaseController({
    siteName: "DevChat",
    song: ".episode__body>h5",

    overridePlayPrev: true,
    overridePlayPause: true,
    overridePlayNext: true
  });

  controller.getPlayer = function() {
    return document.getElementsByTagName("audio")[0]
      || document.getElementsByTagName("video")[0];
  };

  /* Overrides */
  controller.isPlaying = function() {
    try {
      return !this.getPlayer().paused;
    } catch (e) {
      return false;
    }
  };

  controller.playPause = function() {
    if(this.isPlaying()) {
      try {
        this.getPlayer().pause();
        sk_log("playPause");
      } catch(e) {
        sk_log("playPause", e, true);
      }
    } else {
      try {
        this.getPlayer().play();
        sk_log("playPause");
      } catch(e) {
        sk_log("playPause", e, true);
      }
    }
  };

  controller.playNext = function() {
    try {
      this.getPlayer().currentTime += 15;
      sk_log("playNext");
    } catch (exception) {
      sk_log("playNext", exception, true);
    }
  };

  controller.playPrev = function() {
    try {
      this.getPlayer().currentTime -= 15;
      sk_log("playPrev");
    } catch (exception) {
      sk_log("playPrev", exception, true);
    }
  };
})();
