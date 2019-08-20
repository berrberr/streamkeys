(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Jango",
    playPause: "#btn-playpause",
    playNext: "#btn-ff",
    like: "#btn-fav",
    dislike: "#player_ban",

    playState: "#btn-playpause.pause",
    song: "#current-song",
    artist: "#player_current_artist > a"
  });
})();
