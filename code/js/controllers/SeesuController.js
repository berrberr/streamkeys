;(function() {
  "use strict";

  var controller = require("BaseController");
  controller.init({
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

  /* */
  controller.injectScript({url: "/js/seesu_inject.js"});
})();
