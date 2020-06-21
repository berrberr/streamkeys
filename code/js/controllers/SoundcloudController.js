"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "SoundCloud",
    playPause: ".playControl",
    playNext: ".skipControl__next",
    playPrev: ".skipControl__previous",
    mute: ".volume__iconWrapper",
    like: ".playbackSoundBadge__like",

    playState: ".playControl.playing",
    song: ".playbackSoundBadge__titleContextContainer > a",
    artist: ".playbackSoundBadge__titleContextContainer > .playbackSoundBadge__title > a > span:nth-of-type(2)",

    hidePlayer: true
  });
})();
