;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "BrainFM",
    play: "#play_button.tc_play",
    pause: "#play_button.tc_pause"
  });
})();
