;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Spotify",
    playPause: "[title='Pause'],[title='Play']",
    playNext: "[title='Next']",
    playPrev: "[title='Previous']",

    playState: "[title='Pause']",
    song: ".now-playing-bar div div [href*='/album/']",
    artist: ".now-playing-bar div div [href*='/artist/']"
  });
})();
