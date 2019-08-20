(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Patari",
    playPause: ".player .playerPlay",
    playNext: ".player .playerMove[title='Next Song']",
    playPrev: ".player .playerMove[title='Previous Song']",

    song: ".player .songName",
    artist: ".player .artistName"
  });
})();
