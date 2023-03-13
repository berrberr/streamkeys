"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Jango",
    playPause: "#player-play-button",
    playNext: "div[aria-label='Click to Skip to Next Song']",
    like: "#body > div:nth-child(14) > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(1)",
    dislike: "#body > div:nth-child(14) > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(2)",

    playState: "#player-play-button[aria-label='Click to Pause']",
    song: "#player-song-title > a",
    artist: "#player-artist > a"
  });
})();
