;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    playPause: ".recording-details button",
    playNext: ".player-controls .next-track",
    playPrev: ".player-controls .prev-track",
  });
})();
