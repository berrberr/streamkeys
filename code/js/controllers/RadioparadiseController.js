"use strict";
(function() {
  var BaseController = require("BaseController");
  var sk_log = require("../modules/SKLog.js");

  var controller = new BaseController({
    siteName: "RadioParadise",
    playPause: "#override",
    playNext: "#psd_button",
    song: "#nowplaying_title",

    overridePlayPause: true
  });

  /** Overrides **/
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

  controller.isPlaying = function() {
    var doc = document.querySelectorAll("iframe")[0].contentDocument;
    var playButton = doc.querySelector("#play_button");

    return (playButton && playButton.classList.contains("button_active"));
  };

  controller.getSongData = function() {
    var doc = document.querySelectorAll("iframe")[0].contentDocument;
    if(doc.querySelector("#nowplaying_title")) return doc.querySelector("#nowplaying_title").textContent;

    return null;
  };
})();
