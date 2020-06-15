"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Palco MP3",
    playPause: "#p_play",
    playState: "#p_play.p_pause",
    mute: ".p_volume",

    song: ".p_musica",
    artist: ".p_artista",

    overridePlayNext: true,
    overridePlayPrev: true
  });

  controller.playNext = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", { "detail": "next" }));
  };

  controller.playPrev = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", { "detail": "prev" }));
  };

  /* Inject script to interact with parent DOM */
  controller.injectScript({ url: "/js/inject/palcomp3_inject.js" });
})();
