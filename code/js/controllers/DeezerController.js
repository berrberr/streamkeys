;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "#player_control_play",
    play: "#player_control_play",
    pause: "#player_control_pause",
    playNext: "#player_control_next",
    playPrev: "#player_control_prev",
    mute: "#player_volume_0"
  });
})();
