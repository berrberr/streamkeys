;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "iHeartRadio",
    playPause: ".icon-play",
    play: ".icon-play",
    pause: ".icon-stop",
    playNext: "[aria-label=Skip]",
    mute: "[aria-label=Mute]",

    playState: "button.playing",
    song: "a.player-song",
    artist: "a.player-artist"
  });
})();
