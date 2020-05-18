;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "BrainFM",
    playPause: "[class*=PlayControl__wrapper___]",
    buttonSwitch: true
  });
})();
