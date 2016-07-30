(function() {
  "use strict";

  var sk_log = require("../modules/SKLog.js");
  if (typeof window.jwplayer === "function") {
    var jw = window.jwplayer();

    // Make the play state available in the DOM
    $("body").append("<div id='sk-state' class='sk-play'>");
    jw.onPlay(function() {
      $("#sk-state").removeClass("sk-pause").addClass("sk-play");
    });
    jw.onPause(function() {
      $("#sk-state").removeClass("sk-play").addClass("sk-pause");
    });

    // Map events to player controls
    document.addEventListener("streamkeys-cmd", function(e) {
      try {
        if(e.detail === "playPause") {
          jw.pause();
        } else if(e.detail === "next") {
          jw.playlistNext();
        } else if (e.detail === "prev") {
          jw.playlistPrev();
        } else if (e.detail === "mute") {
          jw.setMute();
        } else if (e.detail === "stop") {
          jw.stop();
        }
      } catch (exception) {
        sk_log(e.detail, exception, true);
      }
    });
  }
})();
