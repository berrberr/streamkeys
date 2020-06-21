"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Code Radio",
    playPause: "#playContainer",
    playState: "#metaDisplay.shown",
    song: "#nowPlaying > div[data-meta='title']",
    artist: "#nowPlaying > div[data-meta='artist']",
    album: "#nowPlaying > div[data-meta='album']",
    art: "#metaDisplay > img[data-meta='picture']",
    currentTime: "currentTime",
    totalTime: "totalTime"
  });

  controller.getSongData = function(selector) {
    if (selector === "currentTime") {
      return secondsToHMS(this.doc().querySelector("#nowPlaying > progress").getAttribute("value"));
    } else if (selector === "totalTime") {
      return secondsToHMS(this.doc().querySelector("#nowPlaying > progress").getAttribute("max"));
    }
    return BaseController.prototype.getSongData.call(this, selector);
  };

  function secondsToHMS(str) {
    var totalSeconds = Math.max(parseInt(str, 10), 0);
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return (hours ? hours + ":" : "") + ((hours ? "0" : "") + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
  }
})();
