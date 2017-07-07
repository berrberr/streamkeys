(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "22tracks",
    play: ".player .icon-play",
    pause: ".player .icon-pause",
    playNext: ".player .icon-next",
    playPrev: ".player .icon-previous",
    like: ".player .icon-my22",
    buttonSwitch: true,

    song: ".player__progress__title"
  });
})();
