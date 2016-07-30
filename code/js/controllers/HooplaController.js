;(function() {
  "use strict";
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Hoopla",
    playState: "#sk-state.sk-play", // injected element for keeping track of state
    overridePlayPause: true,
    overridePlayPrev: true,
    overridePlayNext: true,
    song: ".playing .segment-name",
    artist: "h5.subheader"
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
