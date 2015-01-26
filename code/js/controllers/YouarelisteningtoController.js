;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "You Are Listening To",
    playPause: "#button_play_pause",
    playNext: "#button_forward",
    playPrev: "#button_back",

    playState: "#button_play_pause[title=pause]"
  });
})();
