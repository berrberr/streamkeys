;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      sk_log = require("../modules/SKLog.js");

  var controller = new BaseController({
    siteName: "Mixcloud",
    playPause: "[m-player-play-button]",
    mute: ".player-volume-percent",
    like: ".icon-favorite-inner:not(.ng-hide)",

    playState: ".player-control.pause-state",
    song: ".player-cloudcast-title",
    artist: ".player-cloudcast-author-link"
  });

  controller.mute = function() {
    sk_log("mute");
    var muteSlider = document.querySelector(this.selectors.mute);
    muteSlider.style.height = (muteSlider.style.height === "0px") ? "100%": "0";
  };
})();
