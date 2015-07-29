;(function() {
  "use strict";

  var controller = require("BaseController");

  var isNew = document.querySelector("#loading_bar") !== null;

  controller.init({
    siteName: "Deezer",
    playPause: ".control.control-play",
    play: ".control.control-play",
    pause: ".control.control-pause",
    playNext: ".control.control-next",
    playPrev: ".control.control-prev",
    mute: ".icon-volume-off",
    like: ".player-actions .icon-love",
    dislike: ".player-actions .icon-unlove",
    buttonSwitch: isNew,

    song: ".player-track-title > span",
    artist: ".heading-2-sub span.player-track-link"
  });

})();
