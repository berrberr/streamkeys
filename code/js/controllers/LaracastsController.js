;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Laracasts",
    playPause: "#override",

    hidePlayer: true
  });

  /* Overrides */
  controller.playPause = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", {"detail": "playPause"}));
  };

  /* Inject script to interact with parent DOM */
  controller.injectScript({url: "/js/inject/laracasts_inject.js"});
})();
