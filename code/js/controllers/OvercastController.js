"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Overcast.fm",
    playPause: "#playpausebutton",
    playNext: "#seekforwardbutton",
    playPrev: "#seekbackbutton",

    playState: "#playpausebutton_pauseicon",
    song: ".title"
  });
})();
