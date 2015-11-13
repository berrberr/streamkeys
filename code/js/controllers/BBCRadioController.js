;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "BBC Radio",
    play: "#play",
    pause: "#pause",
    playNext: ".od-skip[data-offset='60']",
    playPrev: ".od-skip[data-offset='-60']",
    mute: "#volume-mute",
    like: "#toggle-mystations:not(.in-mystations) > span",
    dislike: "#toggle-mystations.in-mystations > span",

    song: "p.title > a",
    artist: "p.artist > a",

    hidePlayer: true
  });
})();
