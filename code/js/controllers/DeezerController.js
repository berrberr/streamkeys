;(function() {
  "use strict";

  var controller = require("BaseController");

  var isNew = document.querySelector("#loading_bar") !== null;

  controller.init({
    playPause: ".control.control-play",
    play: ".control.control-play",
    pause: ".control.control-pause",
    playNext: ".control.control-next",
    playPrev: ".control.control-prev",
    mute: ".icon-volume-off",
    like: ".icon-love-circle",
    dislike: ".icon-unlove-circle",
    buttonSwitch: isNew
  });

})();
