(function() {
  "use strict";

  var BaseController = require("BaseController"),
    _ = require("lodash");

  var multiSelectors = {
    play: [".playButton", ".PlayButton"],
    pause: [".pauseButton", ".PlayButton"],
    playNext: [".skipButton", ".SkipButton"],
    playPrev: [null, ".ReplayButton"],
    like: [".thumbDownButton > a", ".Tuner__Control__ThumbUp__Button"],
    dislike: [".thumbDownButton > a", ".Tuner__Control__ThumbDown__Button"],

    song: [
      ".playerBarSong",
      ".nowPlayingTopInfo__current__trackName div:nth-child(2) div div"
    ],
    artist: [".playerBarArtist", ".nowPlayingTopInfo__current__artistName"],
    album: [".playerBarAlbum", ".nowPlayingTopInfo__current__albumName"],
    art: [
      ".playerBarArt",
      ".Tuner__Audio__TrackDetail__img > .ImageLoader > .ImageLoader__cover"
    ]
  };

  var controller = new BaseController({
    siteName: "Pandora"
  });

  controller.checkPlayer = function() {
    var that = this;

    if (
      this.doc().querySelector(multiSelectors.play[0]) ||
      this.doc().querySelector(multiSelectors.pause[0])
    ) {
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
