;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Songstr",
    playPause: "#playing_control",

    playState: ".player_stop",
    song: "#playing_title",
    artist: "#playing_artist"
  });
})();
