"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Apple MusicKit JS"
  });

  var state = {
    song: null,
    artist: null,
    album: null,
    art: null,
    isPlaying: false,
    siteName: controller.siteName,
    canDislike: false,
    canPlayPrev: true,
    canPlayPause: true,
    canPlayNext: true,
    canLike: false,
    hidePlayer: false
  };

  document.addEventListener("streamkeys-state", function(e) {
    var data = e.detail;
    state.song = data.title;
    state.artist = data.artistName;
    state.album = data.albumName;
    state.art = data.artworkURL;
    state.isPlaying = data.isPlaying;
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
  controller.stop = function() {
    document.dispatchEvent(new CustomEvent("streamkeys-cmd", { "detail": "stop" }));
  };

  controller.getStateData = function() {
    return Object.assign({}, state);
  };

  controller.injectScript({ url: "/js/inject/musickit_inject.js" });
})();
