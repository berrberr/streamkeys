;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      sk_log = require("../modules/SKLog.js");

  var controller = new BaseController({
    siteName: "Mixcloud",
    playPause: ".player-control",
    mute: ".player-volume-percent",
    like: ".icon-favorite-inner:not(.ng-hide)",
    overridePlayNext: true,
    overridePlayPrev: true,

    playState: ".player-control.pause-state",
    song: ".player-cloudcast-title",
    artist: ".player-cloudcast-author-link"
  });

  controller.mute = function() {
    sk_log("mute");
    var muteSlider = document.querySelector(this.selectors.mute);
    muteSlider.style.height = (muteSlider.style.height === "0px") ? "100%": "0";
  };

  controller.playNext = function() {
    this.doc().querySelector("audio").currentTime += 30;
  };
  controller.playPrev = function() {
    this.doc().querySelector("audio").currentTime -= 30;
  };
})();
