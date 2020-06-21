"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Vimeo",
    playPause: ".play",
    playNext: ".js-pagination--right",
    playPrev: ".js-pagination--left",
    like: ".like-button",
    playState: ".play.state-playing",
    song: "h1 > span:first-child"
  });
})();
