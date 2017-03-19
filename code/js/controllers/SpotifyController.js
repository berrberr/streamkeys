;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      _ = require("lodash");

  var multiSelectors = {
    playPause: ["#play-pause", "#play", "#play-pause"],
    playNext: ["#next", "#next", ".spoticon-skip-forward-24"],
    playPrev: ["#previous", "#previous", ".spoticon-skip-back-24"],
    playState: ["#play-pause.playing", "#play.playing", ".spoticon-pause-32"],
    iframe: ["#app-player", "#main", "#app-player"],
    like: [".thumb.up", ".thumb.up", null],
    dislike: [".thumb.down", ".thumb.down", null],
    song: ["#track-name", ".caption .track", ".now-playing-bar div div [href*='/album/']"],
    artist: ["#track-artist", ".caption .artist", ".now-playing-bar div div [href*='/artist/']"]
  };

  var controller = new BaseController({
    siteName: "Spotify"
  });

  controller.checkPlayer = function() {
    var that = this;
    var selectorIndex;

    if (window.location.hostname === "open.spotify.com" || window.location.hostname === "play.spotify.com") {
      selectorIndex = 2;
    } else {
      if (document.querySelector(multiSelectors.iframe[0])) { selectorIndex = 0; }
      if (document.querySelector(multiSelectors.iframe[1])) { selectorIndex = 1; }
    }

    _.each(multiSelectors, function(value, key) {
      that.selectors[key] = value[selectorIndex];
    });
  };
})();
