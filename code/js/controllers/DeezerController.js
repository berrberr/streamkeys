;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Deezer",

    buttonSwitch: true,
    pause: ".player-controls button[aria-label=Pause]",
    play: ".player-controls button[aria-label=Play]",
    playNext: ".player-controls button[aria-label=Next]",
    playPrev: ".player-controls button[aria-label=Back]",
    playState: ".player-controls button[aria-label=Pause]",
  
    song: "a.track-link:nth-of-type(1)",
    artist: "a.track-link:nth-of-type(2)"

  });
})();
