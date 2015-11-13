;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Last.fm",
    playPause: "#radioControlPlay",
    play: "#radioControlPlay",
    pause: "#radioControlPause",
    playNext: "#radioControlSkip",
    like: "#radioControlLove",

    song: "span.track > a",
    artist: "span.artist > a",
    album: "span.album > span.title > a",

    hidePlayer: true
  });
})();
