;(function() {
  "use strict";

  var BaseController = require("BaseController"),
    sk_log = require("../modules/SKLog.js");

  function getPlayer() {
    return document.querySelector("video");
  }

  var controller = new BaseController({
    siteName: "Crave",

    overridePlayPause: true,
    playState: ".jwplayer.jw-state-playing",
  });

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
})();
