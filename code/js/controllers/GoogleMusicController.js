;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Google Play Music",
    playPause: "[data-id=play-pause]",
    playNext: "[data-id=forward]",
    playPrev: "[data-id=rewind]",
    like: "#player-right-wrapper li[data-rating='5']",
    dislike: "#player-right-wrapper li[data-rating='1']",

    playState: ".flat-button.playing",
    song: "#playerSongTitle",
    artist: "#player-artist",
    album: ".player-album"
  });
})();
