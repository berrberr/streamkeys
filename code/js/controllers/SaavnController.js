;(function() {
  "use strict";

  var controller = require("BaseController");

  controller.init({
    playPause: "#play",
    play: "#play",
    pause: "#pause",
    playNext: "#fwd",
    playPrev: "#rew",
    mute: "#mute",
    buttonSwitch: false
  });
})();
