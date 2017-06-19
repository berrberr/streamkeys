(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "SomaFM",
    buttonSwitch: true,
    play: "#playBtn",
    pause: "#stopBtn",

    playState: "#stopBtn"
  });
})();
