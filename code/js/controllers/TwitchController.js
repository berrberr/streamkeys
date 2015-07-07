;(function() {
  "use strict";

  var controller = require("BaseController"),
      sk_log = require("../modules/SKLog.js");

  controller.init({
    siteName: "Twitch.tv",
    playPause: "#override",
    song: ".title .real"
  });

  controller.selectors.twitchPlayer = "object[data$=TwitchPlayer\\.swf]";
  controller.twitchPlayer = null;

  controller.isPlaying = function() {
    if(this.twitchPlayer && this.twitchPlayer.isPaused) {
      return !this.twitchPlayer.isPaused();
    } else {
      try {
        this.twitchPlayer = document.querySelector(this.selectors.twitchPlayer);
      } catch (e) {
        sk_log("Twitch player not found", e, true);
        return false;
      }
    }

  };

  controller.playPause = function() {
    if(this.isPlaying()) {
      try {
        this.twitchPlayer.pauseVideo();
        sk_log("playPause");
      } catch(e) {
        sk_log("Twitch player error", e, true);
      }
    } else {
      try {
        this.twitchPlayer.playVideo();
        sk_log("playPause");
      } catch(e) {
        sk_log("Twitch player error", e, true);
      }

    }
  };

})();
