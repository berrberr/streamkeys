;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "#audio_player-play",
    playNext: "#audio_player-skip",
    mute: "#audio_player-volume"
  });
})();
