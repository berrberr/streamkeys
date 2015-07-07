;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "SoundCloud",
    playPause: ".playControl",
    playNext: ".skipControl__next",
    playPrev: ".skipControl__previous",
    mute: ".volume__iconWrapper",
    like: ".playbackSoundBadge__like",

    playState: ".playControl.playing",
    song: ".playbackSoundBadge__title > span:nth-of-type(2)",
    artist: ".m-playing .soundTitle__username",

    hidePlayer: true
  });
})();
