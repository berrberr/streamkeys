(function() {
  "use strict";

  var sk_log = require("../modules/SKLog.js");

  var audio = document.getElementsByTagName("audio")[0];

  if(audio === undefined) return null;

  document.addEventListener("streamkeys-cmd", function(e) {

    audio = document.getElementsByTagName("audio")[0];

    if(e.detail === "playPause") {
      if(!audio.paused) {
        try {
          audio.pause();
          $(audio).removeClass("sk-not");
          sk_log("playPause");
        } catch (exception) {
          sk_log("playPause", exception, true);
        }
      } else {
        try {
          audio.play();
          $(audio).addClass("sk-not");
          sk_log("playPause");
        } catch (exception) {
          sk_log("playPause", exception, true);
        }
      }
    } else if(e.detail === "next") {
      try {
        audio.currentTime += 15;
        sk_log("playNext");
      } catch (exception) {
        sk_log("playNext", exception, true);
      }
    } else if(e.detail === "prev") {
      try {
        audio.currentTime -= 15;
        sk_log("playPrev");
      } catch (exception) {
        sk_log("playPrev", exception, true);
      }
    }
  });

})();
