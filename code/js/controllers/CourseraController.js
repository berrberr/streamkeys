;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Coursera",
    play: ".mejs-play",
    pause: ".mejs-pause",
    playNext: ".course-lecture-view-speed-plus",
    playPrev: ".course-lecture-view-speed-minus",
    iframe: ".course-modal-frame iframe",
    buttonSwitch: true,

    song: ".course-modal-frame-title"
  });
})();
