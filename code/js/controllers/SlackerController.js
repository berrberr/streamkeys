;(function() {
  "use strict";

  require("BaseController").init({
    playPause: "a.play",
    play: "a.play",
    pause: "a.pause",
    playNext: "li.skip-forward > a",
    playPrev: "li.skip-back > a",
    like: "li.love > a",
    dislike: "li.banning > a"
  });
})();
