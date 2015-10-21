;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Xiami",
    playPause: "#J_playBtn",
    playNext: "#J_nextBtn",
    playPrev: "#J_prevBtn",
    mute: "#J_volumeSpeaker",
    like: "#J_trackFav.icon-fav",
    dislike: "#J_trackFav.icon-faved",

    song: "#J_trackName",
    artist: "#J_trackInfo :last-child"
  });
})();
