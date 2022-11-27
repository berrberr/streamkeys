"use strict";
(function () {
  var BaseController = require("BaseController"),
    _ = require("lodash");

  //Playlist controls, Station controls
  var multiSelectors = {
    playNext: [".Tuner__Control__SkipForward__Button", ".Tuner__Control__Skip__Button"],
    playPrev: [".Tuner__Control__SkipBack__Button", ".ReplayButton:not(.TunerControl--disabled)"],
    album: [".HeroCard__sourceInfo__album", ".nowPlayingTopInfo__current__albumName"]
  };

  var controller = new BaseController({
    siteName: "Pandora",
    playState: "button.PlayButton[aria-checked=true]",
    playPause: ".PlayButton",
    //Liking an already liked song unlikes the song so enable if song isn't already liked
    like: ".ThumbUpButton[aria-checked=false]",
    dislike: ".ThumbDownButton",
    song:  ".Tuner__Audio__TrackDetail__title",
    artist: ".Tuner__Audio__TrackDetail__artist",
    art: ".ImageLoader [data-qa='mini_track_image']",
    currentTime: ".VolumeDurationControl__Duration [data-qa='elapsed_time']",
    totalTime: ".VolumeDurationControl__Duration [data-qa='remaining_time']"
  });

  controller.checkPlayer = function () {
    var that = this;

    if (this.doc().querySelector(multiSelectors.playNext[0])) {
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
