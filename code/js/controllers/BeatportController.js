;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      _ = require("lodash");

  var multiSelectors = {
    play: [".omniplayer button[title=Play]", ".video-btn.play-icon"],
    pause: [".omniplayer button[title=Pause]", ".video-btn.pause-icon"],
    playNext: [".omniplayer--action-icon.next", null],
    playState: [".omniplayer.is-playing", null],
    mute: [".omniplayer--volume-icon", "#mute"],
    like: [".omniplayer--action-icon.heart", null],
    song: [".omniplayer--title", ".stream-description .overview h1"],
    artist: [".omniplayer--artist", ".channel-text h1"]
  };

  var controller = new BaseController({
    siteName: "Beatport"
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
