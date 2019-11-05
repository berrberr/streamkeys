;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Telegram Web",
    playPause: ".header-player > button:nth-child(2)",
    playNext: ".header-player > button:nth-child(3)",
    playPrev: ".header-player > button:nth-child(1)",
    mute: ".header-player > div + div > button",
    song: ".header-player-title"
  });

})();
