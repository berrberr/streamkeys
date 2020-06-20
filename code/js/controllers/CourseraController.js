"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Coursera",
    play: ".cif-play",
    pause: ".cif-pause",
    playNext: "[data-track-component='item_side_nav_next_lession']",
    playPrev: "[data-track-component='item_side_nav_prev_lession']",
    buttonSwitch: true,

    song: ".c-video-title"
  });
})();
