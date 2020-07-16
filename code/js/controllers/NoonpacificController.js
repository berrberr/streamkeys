"use strict";
(function() {
  var BaseController = require("BaseController"),
    _ = require("lodash");

  var multiSelectors = {
    play: ["#player a:nth-child(2)", ".fa-play"],
    pause: ["#player a:nth-child(3)", ".fa-pause"],
    playNext: ["#player a:nth-child(4)", ".fa-forward"],
    playPrev: ["#player a:nth-child(1)", ".fa-backward"],

    playState: ["#player .ng-hide .icon-play", ".fa-pause"],
    song: ["h1.break-word", ".audio-player-song p"],
    artist: [null, ".audio-player-artist p"]
  };

  var controller = new BaseController({
    siteName: "Noon Pacific"
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
