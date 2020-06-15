"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Hoopla",
    playState: "#sk-state.sk-play", // injected element for keeping track of state
    overridePlayPause: true,
    overridePlayPrev: true,
    overridePlayNext: true,
    song: ".rmq-55a86633" // not sure how permanent this react class is, but it is the best option right now for getting the song name
    // artist name not obtainable from DOM
  });

  controller.playPause = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", { "detail": "playPause" }));
  };
  controller.playNext = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", { "detail": "next" }));
  };
  controller.playPrev = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", { "detail": "prev" }));
  };
  controller.mute = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", { "detail": "mute" }));
  };
  controller.stop = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", { "detail": "stop" }));
  };

  controller.injectScript({ url: "/js/inject/hoopla_inject.js" });
})();
