;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "lovelinetapes",
    play: ".jp-controls .jp-play",
    pause: ".jp-controls .jp-pause",
    buttonSwitch: false,
    song: ".details .textHeader"
  });
})();
