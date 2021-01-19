"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Promo DJ",

    play: "img.playerr_bigplaybutton",
    pause: "img.playerr_bigpausebutton",
    buttonSwitch: true,

    playState: "img.playerr_bigpausebutton",
    song: ".current",
    artist: "title"
  });
})();
