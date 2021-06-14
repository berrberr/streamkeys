"use strict";
(function () {
  var BaseController = require("BaseController");

  const controller = new BaseController({
    playPause: "div.play-pause-btn",
    song: "a.list-group-item.active",
    artist: "li.breadcrumb-item-active a",
    buttonSwitch: false,
    art: ".info-box p"
  });

  controller.isPlaying = function () {
    var playEl = this.doc().querySelector("div.play-pause-btn svg path"),
      isPlaying = (playEl.attributes.d.value !== "M18 12L0 24V0");
    return isPlaying;
  };
})();
