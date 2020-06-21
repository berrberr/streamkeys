"use strict";
(function() {
  var sk_log = require("../modules/SKLog.js");
  if (typeof window.jwplayer === "function") {
    // Make the play state available in the DOM
    $("body").append("<div id='sk-state' class='sk-play'>");

    var onPlayPauseRegistered = false;

    document.addEventListener("streamkeys-cmd", function(e) {
      var jw = window.jwplayer();
      if (!jw) {
        return;
      }

      // Register onPlay and onPause callbacks to toggle state
      if (!onPlayPauseRegistered) {
        jw.onPlay(function() {
          $("#sk-state").removeClass("sk-pause").addClass("sk-play");
        });
        jw.onPause(function() {
          $("#sk-state").removeClass("sk-play").addClass("sk-pause");
        });
      }
      onPlayPauseRegistered = true;

      try {
        switch (e.detail) {
        case "playPause":
          jw.pause();
          break;
        case "next":
          jw.playlistNext();
          break;
        case "prev":
          jw.playlistPrev();
          break;
        case "mute":
          jw.setMute();
          break;
        case "stop":
          jw.stop();
          break;
        }
      } catch (exception) {
        sk_log(e.detail, exception, true);
      }
    });
  }
})();
