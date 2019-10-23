;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Phenopod",
    playPause: "header ~ div button:nth-child(2)",
    playNext: "header ~ div button:nth-child(3)",
    playPrev: "header ~ div button:nth-child(1)",

    playState: "header ~ div button:nth-child(2):not([class~='3'])",
    song: "header ~ div .-mb-1>div:first-child",
    artist: "header ~ div .-mb-1>div:last-child",
    art: "img"
  });
})();
