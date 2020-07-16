"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Castbox",
    playPause: ".playBtn",
    playNext: ".forward",
    playPrev: ".back",
    mute: ".volumeCtrl",

    playState: ".playBtn.icon.play",
    song: ".footerFeed .rightText .title.ellipsis",
    currentTime: ".currentTime",
    totalTime: ".duration",

    artist: ".footerFeed .rightText .author.ellipsis"
  });
})();
