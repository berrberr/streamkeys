(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "DevChat",
    playPause: "#override",
    playNext: "#override",
    playPrev: "#override",
    song: ".episode__body>h5",

    playState: ".sk-not",
    overridePlayPrev: true,
    overridePlayPause: true,
    overridePlayNext: true
  });

  /* Overrides */
  controller.playPause = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", {
      "detail": "playPause"
    }));
  };
  controller.playNext = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", {
      "detail": "next"
    }));
  };
  controller.playPrev = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", {
      "detail": "prev"
    }));
  };

  /* Inject script to interact with parent DOM */
  controller.injectScript({
    url: "/js/inject/devchat_inject.js"
  });
})();
