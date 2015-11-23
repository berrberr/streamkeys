;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "BBC Radio",
    play: "#btn-play",
    pause: "#btn-pause",
    mute: "#volume-mute",
    like: "#toggle-mystations:not(.in-mystations) > span",
    dislike: "#toggle-mystations.in-mystations > span",

    song: "#title",
    artist: "#parent-title",

    hidePlayer: true
  });
})();
