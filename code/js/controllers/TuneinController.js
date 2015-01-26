;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "TuneIn",
    playPause: ".playbutton-cont",

    playState: "#tuner.playing",
    song: ".line1._navigateNowPlaying"
  });
})();
