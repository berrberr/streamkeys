"use strict";
(function() {
  var BaseController = require("BaseController"),
    sk_log = require("../modules/SKLog.js");

  var controller = new BaseController({
    siteName: "Feedly",
    playPause: "audio",
    playNext: ".slideBumper-right",
    playPrev: ".slideBumper-left",
    song: ".entryTitle"
  });

  controller.getPlayer = function() {
    return document.querySelector("audio");
  };

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
        sk_log("Feedly player error", e, true);
      }
    } else {
      try {
        this.getPlayer().play();
        sk_log("playPause");
      } catch(e) {
        sk_log("Feedly player error", e, true);
      }
    }
  };

})();
