;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "imusic",
    play: ["#playBtn"],
    pause: ["#pauseBtn"],
    playNext: "#seekForward",
    playPrev: "#seekBackward",

    artist: "#p_songTitle .f_artist",
    song: "#p_songTitle .f_album",
    hidePlayer: false,
    art: "#albumCover .art",

    currentTime: "#playerProgressTime"
  });

})();
