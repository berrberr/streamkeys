;(function() {
  "use strict";

  var controller = require("BaseController");
  controller.init({
    siteName: "Laracasts",
    playPause: "#override"
  });

  /* Overrides */
  controller.playPause = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", {"detail": "playPause"}));
  };

  /* Inject script to interact with parent DOM */
  controller.injectScript({url: "/js/inject/laracasts_inject.js"});
})();
