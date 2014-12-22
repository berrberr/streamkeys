;(function() {
  "use strict";

  require("BaseController").init({
    playPause: ".playButton",
    play: ".playButton",
    pause: ".pauseButton",
    playNext: ".skipButton",
    like: ".thumbUpButton > a",
    dislike: ".thumbDownButton > a"
  });
})();
