; (function () {
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

    song: [".playerBarSong", ".Tuner__Audio__TrackDetail__title"],
    artist: [".playerBarArtist", ".Tuner__Audio__TrackDetail__artist"],
    album: [".playerBarAlbum", ".nowPlayingTopInfo__current__albumName"],
    art: [".playerBarArt", ".Tuner__Audio__TrackDetail__img > .ImageLoader > .ImageLoader__cover"],

    currentTime: [null, ".VolumeDurationControl__Duration [data-qa='elapsed_time']"],
    totalTime: [null, ".VolumeDurationControl__Duration [data-qa='remaining_time']"]
  };

  var controller = new BaseController({
    siteName: "Pandora"
  });

  controller.checkPlayer = function () {
    var that = this;

    if (this.doc().querySelector(multiSelectors.play[0]) || this.doc().querySelector(multiSelectors.pause[0])) {
      _.forEach(multiSelectors, function (value, key) {
        that.selectors[key] = value[0];
      });
    } else {
      _.forEach(multiSelectors, function (value, key) {
        that.selectors[key] = value[1];
      });
    }
  };
})();
