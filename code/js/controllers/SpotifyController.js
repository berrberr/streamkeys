;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      _ = require("lodash");

  var multiSelectors = {
    play: [null, ".now-playing-bar button[title=Play]"],
    pause: [null, ".now-playing-bar button[title=Pause]"],
    playPause: ["#play-pause", null],
    playNext: ["#next", ".now-playing-bar button[title=Next]"],
    playPrev: ["#previous", ".now-playing-bar button[title=Previous]"],
    playState: ["#play-pause.playing", ".now-playing-bar button[title=Pause]"],
    iframe: ["#app-player", null],
    like: [".thumb.up", null],
    dislike: [".thumb.down", null],
    song: ["#track-name", ".now-playing-bar div div [href*='/album/']"],
    artist: ["#track-artist", ".now-playing-bar div div [href*='/artist/']"]
  };

  var controller = new BaseController({
    siteName: "Spotify"
  });

  controller.checkPlayer = function() {
    var that = this;
    var selectorIndex = window.location.hostname === "open.spotify.com" ? 1 : 0;

    _.each(multiSelectors, function(value, key) {
      that.selectors[key] = value[selectorIndex];
    });
  };
})();
