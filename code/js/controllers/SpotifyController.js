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
    like: [".thumb.up", ".thumb.up"],
    dislike: [".thumb.down", ".thumb.down"],
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
    var that = this;
    var player = document.querySelector(multiSelectors.iframe[0]) ? "v1" : "v2";

    if(player == "v1") {
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[0];
      });
    } else {
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[1];
      });
    }
  };
})();
