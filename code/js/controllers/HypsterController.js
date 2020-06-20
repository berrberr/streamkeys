"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Hypster",
    playPause: "#PlPs_btn",
    playNext: "#Next_btn",
    playPrev: "#Prev_btn",
    mute: "#Mute_btn",

    song: "#plstNameCH"
  });
})();
