;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      _ = require("lodash");

  var multiSelectors = {
    play: [".playButton", ".PlayButton"],
    pause: [".pauseButton", ".PlayButton"],
    playNext: [".skipButton", ".SkipButton"],
    playPrev: [null, ".ReplayButton"],
    like: [".thumbUpButton > a", ".ThumbUpButton"],
    dislike: [".thumbDownButton > a", ".ThumbDownButton"],

    song: [".playerBarSong", ".nowPlayingTopInfo__current__trackName div:nth-child(2) div div"],
    artist: [".playerBarArtist", ".nowPlayingTopInfo__current__artistName"],
    album: [".playerBarAlbum", ".nowPlayingTopInfo__current__albumName"]
  };

  var controller = new BaseController({
    siteName: "Pandora"
  });

  controller.checkPlayer = function() {
    var that = this;

    if(this.doc().querySelector(multiSelectors.play[0]) || this.doc().querySelector(multiSelectors.pause[0])) {
      _.each(multiSelectors, function(value, key) {
        that.selectors[key] = value[0];
      });
    } else {
      _.each(multiSelectors, function(value, key) {
        that.selectors[key] = value[1];
      });
    }
  };
})();
