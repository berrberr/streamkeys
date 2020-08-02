"use strict";
(function() {

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Radio Garden",
    playPause: "div[class*=\"PlayBar_controlsContainer\"]>div:nth-child(2)",
    playNext: "div[class*=\"PlayBar_controlsContainer\"]>div:nth-child(3)",
    playPrev: "div[class*=\"PlayBar_controlsContainer\"]>div:nth-child(1)",

    like: "div[class*=\"WideIconButton_iconButton\"]:nth-child(1)",

    playState: "div[class*=\"PlayBar_controlsContainer\"]>div:nth-child(2) svg>rect",
    song: "div[class*=\"ChannelTitle_title\"]",
    artist: "div[class*=\"ChannelTitle_subtitle\"]",
  });
})();
