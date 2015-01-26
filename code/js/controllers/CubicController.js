;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Cubic.fm",
    playPause: ".control.play",
    play: ".control.play",
    pause: ".control.pause",
    playNext: ".control.next",
    playPrev: ".control.previous",
    like: ".radio > .action.like",
    dislike: ".radio > .action.like",

    playState: ".control.pause",
    song: "div.track_data > div.track_name"
  });
})();
