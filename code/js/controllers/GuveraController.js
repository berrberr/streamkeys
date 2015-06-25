;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Guvera",
    play: ".paused",
    pause: ".playing",
    playNext: ".next-track",
    playPrev: ".prev-track",
    playState: ".playing",
    song: "li.artist-name > a.title",
    artist: "li.track-title> a.title"
  });
})();
