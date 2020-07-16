"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "indieshuffle",
    playPause: "#playerPlaying",
    playNext: "#playNext",
    playPrev: "#playPrevious",

    song: "#player-current > div > a.ajaxlink.pink > div > div > span.title",
    artist: "#player-current > div > a.ajaxlink.pink > div > div > span.artist.bold"
  });
})();
