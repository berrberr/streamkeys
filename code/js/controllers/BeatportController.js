;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Beatport",
    play: ".omniplayer a[title=Play]",
    pause: ".omniplayer a[title=Pause]",
    playNext: ".omniplayer--next-icon",
    mute: ".omniplayer--volume-icon",
    like: ".omniplayer--heart-icon",

    playState: ".omniplayer.is-playing",
    song: ".omniplayer--title",
    artist: ".omniplayer--artist"
  });
})();
