;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      _ = require("lodash");

  var multiSelectors = {
    playPause: ["#play-pause", "#play", "[title='Pause'],[title='Play']"],
    playNext: ["#next", "#next", "[title='Next']"],
    playPrev: ["#previous", "#previous", "[title='Previous']"],
    playState: ["#play-pause.playing", "#play.playing", "[title='Pause']"],
    iframe: ["#app-player", "#main", null],
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

    if (window.location.hostname === "open.spotify.com") {
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
