(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "radd.it",
    play: ".btns .resume",
    pause: ".btns .pause",
    playNext: ".btns .next",
    playPrev: ".btns .prev",
    like: ".addLike",

    song: "body > ul:first-of-type li.active i",
    artist: "body > ul:first-of-type li.active b"
  });
})();
