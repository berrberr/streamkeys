(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Sony Music Unlimited",
    playPause: "#PlayerPlayPause",
    playNext: "#PlayerNext",
    playPrev: "#PlayerPrevious",
    mute: "#PlayerToggleMute"
  });
})();
