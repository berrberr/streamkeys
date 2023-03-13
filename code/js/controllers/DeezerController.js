"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Deezer",

    playPrev: "div.player-controls > ul > li:nth-child(1) > button",
    playPause: "div.player-controls > ul > li:nth-child(3) > button",
    playNext: "div.player-controls > ul > li:nth-child(5) > button",
    playState: "svg[data-testid='PauseIcon']",
    dislike: "div.track-actions > ul > li:nth-child(3) > div > button",

    mute: "div.player-options > ul > li:nth-child(1) > ul > li:nth-child(4) > button",

    song: "a.track-link:nth-of-type(1)",
    artist: "a.track-link:nth-of-type(2)"
  });

  controller.dislike = function() {
    if(!document.querySelector("button.dislike-extended")) {
      document.querySelector("div.track-actions > ul > li:last-child > div > button").click();
    }
    document.querySelector("button.dislike-extended").click();
  };
})();
