;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Ampache",
    play: "a.jp-play",
    pause: "a.jp-pause",
    playNext: "a.jp-next",
    playPrev: "a.jp-previous",
    mute: "a.jp-mute",

    playState: "a.jp-pause",
    song: "#webplayer > div.playing_info > div.playing_title > a",
    artist: "#webplayer > div.playing_info > div.playing_artist > a",
  });
})();
