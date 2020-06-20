"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "SomaFM",
    buttonSwitch: true,
    play: ".btn[ng-click^=\"play\"]",
    pause: ".btn[ng-click^=\"stop\"]",

    playState: ".btn[ng-click^=\"stop\"]"
  });
})();
