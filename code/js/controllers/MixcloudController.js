;(function() {
  "use strict";

  var controller = require("BaseController"),
      sk_log = require("../modules/sk_log.js");

  controller.init({
    playPause: "[m-player-play-button]",
    mute: ".player-volume-percent"
  });

  controller.mute = function() {
    sk_log("mute");
    var muteSlider = document.querySelector(this.selector_mute);
    muteSlider.style.height = (muteSlider.style.height === "0px") ? "100%": "0";
  };
})();
