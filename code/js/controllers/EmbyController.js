;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Emby",
    play: ".btnPause",
    pause: ".btnPause",
    playNext: ".btnNextTrack",
    playPrev: ".btnPreviousTrack",
/*
    playState: ".unpauseButton.hide"
*/
  });
})();
