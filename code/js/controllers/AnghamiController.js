;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Anghami",
    dislike: "i.like.liked",
    like: "i.like:not(.liked)",
    playNext: "button[data-method='next']",
    playPause: "button[data-method='play']",
    playPrev: "button[data-method='prev']",

    album: "a.trackalbum",
    artist: "a.trackartist",
    playState: "button[class*='icon-pause']",
    song: "a.tracktitle"
  });
})();
