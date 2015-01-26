;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Last.fm",
    playPause: "#radioControlPlay",
    play: "#radioControlPlay",
    pause: "#radioControlPause",
    playNext: "#radioControlSkip",
    like: "#radioControlLove",

    song: "span.track > a",
    artist: "span.artist > a",
    album: "span.album > span.title > a"
  });
})();
