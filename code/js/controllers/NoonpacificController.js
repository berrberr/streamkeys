;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Noon Pacific",
    play: "#player a:nth-child(2)",
    pause: "#player a:nth-child(3)",
    playNext: "#player a:nth-child(4)",
    playPrev: "#player a:nth-child(1)",

    playState: "#player .ng-hide .icon-play",
    song: "h1.break-word"
  });
})();
