;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "YouTube Music",
    playPause: ".play-pause-button",
    playNext: ".next-button",
    playPrev: ".previous-button",
    mute: ".volume",
    like: ".thumbs > .like",
    dislike: ".thumbs > .dislike",

    playState: ".play-pause-button[aria-label='Pause']",
    song: "song",
    artist: "artist",
    album: "album",
    art: ".ytmusic-player-bar > .image",
  });

  controller.getSongData = function(selector) {
    if (selector === "song") {
      var titleEl = this.doc().querySelector(".content-info-wrapper > .title");
      if (titleEl && titleEl.textContent) {
        return titleEl.textContent;
      }
    } else {
      var subTitleEl = this.doc().querySelector(".content-info-wrapper .subtitle > .byline");
      if (subTitleEl && subTitleEl.innerText) {
        var data = subTitleEl.innerText.split(" • ");
        if (!data) return null;
        if (selector === "artist" && data.length >= 1) return data[0];
        if (selector === "album" && data.length >= 2) return data[1];
      }
    }
    return null;
  };
})();
