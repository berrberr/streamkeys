"use strict";
(function() {
  var MouseEventController = require("MouseEventController");

  var controller = new MouseEventController({
    siteName: "Rainwave",
    playPause: ".audio_icon_play",

    playState: ".playing",
    song: ".song.now_playing .title",
    artist: ".song.now_playing .artist",
    album: ".song.now_playing .album"
  });


  controller.playPause = function() {
    this.mouseclick({ selectorButton: this.selectors.playPause });
  };
})();
