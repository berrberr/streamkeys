;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Zonga",
    play: "div#play.FL.pe-true",
    pause: "div#play.FL.pe-true",
    playNext: "div#next.FL",
    playPrev: "div#prev.FL"
  });
})();
