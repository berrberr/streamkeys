"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Deezer",

    playPrev: "div.player-controls > ul > li:nth-child(1) > div > button",
    playPause: "div.player-controls > ul > li:nth-child(3) > button",
    playNext: "div.player-controls > ul > li:nth-child(5) > div > button",
    playState: "svg.svg-icon-pause",

    mute: "div.player-options > ul > li:nth-child(1) > ul > li:nth-child(3) > div > button",

    song: "a.track-link:nth-of-type(1)",
    artist: "a.track-link:nth-of-type(2)"
  });
})();
