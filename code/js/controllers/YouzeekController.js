(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "YOUZEEK",
    playPause: "#PlayButton",
    playState: ".fa-pause",
    playNext: "#PlayerNext",
    playPrev: "#PlayerPrev",
    song: "span.SongArtistUI",
    artist: "span.SongTitleUI"
  });
})();
