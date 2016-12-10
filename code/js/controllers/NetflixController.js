;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Netflix",
    play: ".button-nfplayerPlay",
    pause: ".button-nfplayerPause",
    playNext: ".button-nfplayerNextEpisode",
    mute: ".button-volumeLow, .button-volumeMedium, .button-volumeMax, .button-volumeMuted",
    playState: ".button-nfplayerPause",
    song: ".title"
  });
})();
