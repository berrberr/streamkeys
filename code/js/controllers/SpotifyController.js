;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Spotify",
    playPause: "[title='Pause'],[title='Play']",
    playNext: "[title='Next']",
    playPrev: "[title='Previous']",

    playState: "[title='Pause']",
    song: ".nowPlayingBar-container [href*='/album/']",
    artist: ".nowPlayingBar-container [href*='/artist/']"
  });
})();
