(function() {
  "use strict";

  var $ = require("jquery");
  var sk_log = require("../modules/SKLog.js");

  var element = document.getElementsByTagName("audio")[0] || document.getElementsByTagName("video")[0];

  if (element === undefined) return null;

  document.addEventListener("streamkeys-cmd", function(e) {

    element = document.getElementsByTagName("audio")[0] || document.getElementsByTagName("video")[0];

    if(e.detail === "playPause") {
      if(!element.paused) {
        try {
          element.pause();
          $(element).removeClass("sk-not");
          sk_log("playPause");
        } catch (exception) {
          sk_log("playPause", exception, true);
        }
      } else {
        try {
          element.play();
          $(element).addClass("sk-not");
          sk_log("playPause");
        } catch (exception) {
          sk_log("playPause", exception, true);
        }
      }
    } else if(e.detail === "next") {
      try {
        element.currentTime += 15;
        sk_log("playNext");
      } catch (exception) {
        sk_log("playNext", exception, true);
      }
    } else if(e.detail === "prev") {
      try {
        element.currentTime -= 15;
        sk_log("playPrev");
      } catch (exception) {
        sk_log("playPrev", exception, true);
      }
    }
  });

})();
