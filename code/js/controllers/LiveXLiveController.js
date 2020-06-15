"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "LiveXLive",
    play: "a.play",
    pause: "a.pause",
    playNext: "li.skip-forward > a",
    playPrev: "li.skip-back > a",
    like: "li.love > a",
    dislike: "li.banning > a",

    playState: ".playpause.play"
  });
})();
