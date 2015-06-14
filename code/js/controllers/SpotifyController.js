;(function() {
  "use strict";

  var controller = require("BaseController"),
      $ = require("jquery");

  var multiSelectors = {
    playPause: ["#play-pause", "#play"],
    playNext: ["#next", "#next"],
    playPrev: ["#previous", "#previous"],
    playState: ["#play-pause.playing", "#play.playing"],
    iframe: ["#app-player", "#main"],
    song: ["#track-name", ".caption .track"],
    artist: ["#track-artist", ".caption .artist"]
  };

  controller.init({
    siteName: "Spotify",
    playPause: "#play-pause",
    playNext: "#next",
    playPrev: "#previous",
    like: "#track-add",
    iframe: "#app-player",

    playState: "#play-pause.playing",
    song: "#track-name",
    artist: "#track-artist"
  });


  controller.checkPlayer = function() {
    var that = this,
        doc = document.querySelector(multiSelectors.iframe[0]);

    if(doc.querySelector(multiSelectors.playPause[0])) {
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[0];
      });
    }
    else {
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[1];
      });
    }
  };
})();
