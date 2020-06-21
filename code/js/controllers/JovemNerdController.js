"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Jovem Nerd",
    play: ".player__primary-controllers__play-pause .icon-play",
    pause: ".player__primary-controllers__play-pause .icon-pause",
    playNext: ".player__primary-controllers__15s-forward",
    playPrev: ".player__primary-controllers__15s-back",
    song: ".entry-title",
    buttonSwitch: true,
    hidePlayer: true
  });
})();
