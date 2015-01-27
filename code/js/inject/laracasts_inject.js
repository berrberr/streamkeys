(function() {
  "use strict";

  var sk_log = require("../modules/SKLog.js"),
      player = window.sublime.player("laracasts-video"),
      _skPlayerState = "paused";

  player.on("start", function() {
    _skPlayerState = "playing";
    sk_log(_skPlayerState);
  });
  player.on("play", function() {
    _skPlayerState = "playing";
    sk_log(_skPlayerState);
  });
  player.on("pause", function() {
    _skPlayerState = "paused";
    sk_log(_skPlayerState);
  });

  document.addEventListener("streamkeys-cmd", function(e) {
    if(player && e.detail === "playPause") {
      if(_skPlayerState === "paused") {
        try {
          player.play();
          sk_log("playPause");
        } catch (exception) {
          sk_log("playPause", exception, true);
        }
      } else {
        try {
          player.pause();
          sk_log("playPause");
        } catch (exception) {
          sk_log("playPause", exception, true);
        }
      }
    }
  });

})();
