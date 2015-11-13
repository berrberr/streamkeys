;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Beats Music",
    playPause: "#play_pause_icon",
    playNext: "#t-next",
    playPrev: "#t-prev"
  });
})();
