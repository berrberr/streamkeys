;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Bandcamp",
    playPause: ".playbutton",
    playNext: ".nextbutton",
    playPrev: ".prevbutton",

    playState: ".playbutton.playing",
    song: "a.title_link > span.title",
    artist: "[itemprop=byArtist]",

    hidePlayer: true,

    currentTime: ".time_elapsed",
    totalTime: ".time_total"
  });
})();
