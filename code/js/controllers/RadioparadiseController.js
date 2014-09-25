;(function() {
  "use strict";

  var controller = require("BaseController");
  var sk_log = require("../modules/sk_log.js");

  controller.init({playPause: "#override"});
  controller.playPause = function() {
    var doc = document.querySelectorAll("iframe")[0].contentDocument;
    try {
      var playButton = doc.querySelector("#play_button");
      if(playButton.classList.contains("button_active")) {
        try {
          doc.querySelector("input[title='Stop Audio']").click();
          sk_log("playPause");
        } catch (e) {
          sk_log("Element not found for click.", e, true);
        }
      } else {
        try {
          playButton.click();
          sk_log("playPause");
        } catch (e) {
          sk_log("Element not found for click.", e, true);
        }
      }
    } catch (e) {
      sk_log("Element not found for click.", e, true);
    }
  };
})();
