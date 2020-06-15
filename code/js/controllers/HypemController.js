"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Hype Machine",
    playPause: "#playerPlay",
    playNext: "#playerNext",
    playPrev: "#playerPrev",
    mute: "#player-volume-mute",
    like: "#playerFav",

    playState: "#playerPlay.pause",
    song: "#player-nowplaying > a:nth-of-type(2)",
    artist: "#player-nowplaying > a:nth-of-type(1)"
  });
})();
