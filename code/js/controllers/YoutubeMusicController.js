(function() {
  "use strict";

  var BaseController = require("BaseController");

    new BaseController({
        siteName: "YouTube Music",
        playPause: ".play-pause-button",
        playNext: ".next-button",
        playPrev: ".previous-button",
        mute: ".volume",
        like: ".like",
        dislike: ".dislike",

        playState: ".play-pause-button[aria-label='Pause']",
        song: ".title.style-scope.ytmusic-player-bar",
        artist: ".yt-simple-endpoint.style-scope.yt-formatted-string"
  });
})();
