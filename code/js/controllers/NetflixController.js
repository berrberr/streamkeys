;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      _ = require("lodash");

  var multiSelectors = {
    play: [".player-play-pause.play", ".button-nfplayerPlay"],
    pause: [".player-play-pause.pause", ".button-nfplayerPause"],
    playNext: [".player-next-episode", ".button-nfplayerNextEpisode"],
    mute: [".player-control-button.volume", ".button-volumeLow, .button-volumeMedium, .button-volumeMax, .button-volumeMuted"],

    playState: [".player-play-pause.pause",".button-nfplayerPause"],
    song: [".player-status-main-title", ".title"]
  };

  var controller = new BaseController({
    siteName: "Netflix"
  });

  controller.checkPlayer = function() {
    var that = this;

    if(this.doc().querySelector(multiSelectors.play[0]) || this.doc().querySelector(multiSelectors.pause[0])) {
      _.forEach(multiSelectors, function(value, key) {
        that.selectors[key] = value[0];
      });
    } else {
      _.forEach(multiSelectors, function(value, key) {
        that.selectors[key] = value[1];
      });
    }
  };
})();
