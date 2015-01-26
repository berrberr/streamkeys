;(function() {
  "use strict";

  var controller = require("BaseController");
  controller.init({
    siteName: "Seesu",
    playPause: "#override",
    playNext: "#override",
    playPrev: "#override"
  });

  /* Overrides */
  controller.playPause = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", {"detail": "playPause"}));
  };
  controller.playNext = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", {"detail": "next"}));
  };
  controller.playPrev = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", {"detail": "prev"}));
  };

  /* Inject script to interact with parent DOM */
  controller.injectScript({url: "/js/inject/seesu_inject.js"});
})();
