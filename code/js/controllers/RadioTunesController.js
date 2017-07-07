(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "RadioTunes",
    playPause: "#ctl-play",
    mute: "#btn-volume",

    playState: ".info-container"
  });
})();
