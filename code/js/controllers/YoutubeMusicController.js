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
    currentTime: "currentTime",
    totalTime: "totalTime",
  });

  controller.getSongData = function(selector) {
    var data = null;
    if (selector === "song") {
      var titleEl = this.doc().querySelector(".content-info-wrapper > .title");
      if (titleEl && titleEl.textContent) {
        return titleEl.textContent;
      }

    } else if ((selector === "currentTime") || (selector === "totalTime")) {
      var timeInfo = this.doc().querySelector(".ytmusic-player-bar > .time-info");
      if (timeInfo && timeInfo.textContent) {
          data = timeInfo.textContent.split("/");
          if (!data) return null;
          if (selector === "currentTime" && data.length >= 1) return data[0].trim();
          if (selector === "totalTime" && data.length >= 2) return data[1].trim();
      }

    } else if ((selector === "artist") || (selector === "album")) {
      var subTitleEl = this.doc().querySelector(".content-info-wrapper .subtitle > .byline");
      if (subTitleEl && subTitleEl.innerText) {
        data = subTitleEl.innerText.split("•");
        if (!data) return null;
        if (selector === "artist" && data.length >= 1) return data[0].trim();
        if (selector === "album" && data.length >= 2) return data[1].trim();
      }
    }
    return BaseController.prototype.getSongData.call(this, selector);
  };
})();
