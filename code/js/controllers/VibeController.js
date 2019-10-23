;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Vibe",
    playPause: ".player_controller .control_section .control_area .btn_now",
    playNext: ".player_controller .control_section .control_area .btn_play_next",
    playPrev: ".player_controller .control_section .control_area .btn_play_prev",
    mute: ".player_controller .volume_area .btn_volume",

    playState: ".player_controller .control_section .control_area .btn_now.play",
    song: ".song .link a",
    artist: ".artist .link_artist a",
    art: ".thumb_cover img"
  });
})();
