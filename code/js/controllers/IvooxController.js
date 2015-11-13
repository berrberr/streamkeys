;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "ivoox",
    play: ".jp-play2",
    pause: ".jp-pause2",

    song: "[itemprop=name]"
  });
})();
