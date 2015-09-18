;(function() {
  "use strict";

  var controller = require("BaseController"),
      sk_log = require("../modules/SKLog.js");

  controller.init({
    siteName: "Twitch.tv",
    playPause: "#override",
    song: ".title .real"
  });

  controller.overridePlayPause = true; // Override here so controls are enabled in popup
  controller.selectors.player = "object[data$=TwitchPlayer\\.swf]";
  controller.player = null;

  controller.isPlaying = function() {
    if(this.player && this.player.isPaused) {
      return !this.player.isPaused();
    } else {
      try {
        this.player = document.querySelector(this.selectors.player);
      } catch (e) {
        sk_log("Twitch player not found", e, true);
        return false;
      }
    }
  };

  controller.playPause = function() {
    if(this.isPlaying()) {
      try {
        this.player.pauseVideo();
        sk_log("playPause");
      } catch(e) {
        sk_log("Twitch player error", e, true);
      }
    } else {
      try {
        this.player.playVideo();
        sk_log("playPause");
      } catch(e) {
        sk_log("Twitch player error", e, true);
      }
    }
  };

})();
