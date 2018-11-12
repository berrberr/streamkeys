;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      sk_log = require("../modules/SKLog.js");

  function getPlayer() {
    return document.getElementsByTagName("audio")[0]
      || document.getElementsByTagName("video")[0];
  }

  // Don't create a controller if we can't find a player
  if(!getPlayer()) return;

  var controller = new BaseController({
    siteName: "Embedded Element",
    song: "title",

    overridePlayPrev: true,
    overridePlayPause: true,
    overridePlayNext: true
  });

  /* Overrides */
  controller.isPlaying = function() {
    try {
      return !getPlayer().paused;
    } catch (e) {
      return false;
    }
  };

  controller.playPause = function() {
    if(this.isPlaying()) {
      try {
        getPlayer().pause();
        sk_log("playPause");
      } catch(e) {
        sk_log("playPause", e, true);
      }
    } else {
      try {
        getPlayer().play();
        sk_log("playPause");
      } catch(e) {
        sk_log("playPause", e, true);
      }
    }
  };

  controller.playNext = function() {
    try {
      getPlayer().currentTime += 15;
      sk_log("playNext");
    } catch (exception) {
      sk_log("playNext", exception, true);
    }
  };

  controller.playPrev = function() {
    try {
      getPlayer().currentTime -= 15;
      sk_log("playPrev");
    } catch (exception) {
      sk_log("playPrev", exception, true);
    }
  };
})();
