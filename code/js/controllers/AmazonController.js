;(function() {
  "use strict";

  var controller = require("BaseController");
  controller.init({
    siteName: "Amazon Music",
    playPause: "[playeraction=togglePlay]",
    playNext: "[playeraction=next]",
    playPrev: "[playeraction=previous]",
    mute: "#volumeIcon",
    like: "#thumbsUp > span",
    dislike: "#thumbsDown > span",

    playState: "#mp3Player .playing",
    song: "#nowPlayingSection .title",

    hidePlayer: true
  });

  /* Overrides */
  controller.playControlsClick = function(div) {
    this.fireEvent = function(element, event, data){
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true );
      if (data) evt.data = data;
      return!document.querySelector(element).dispatchEvent(evt);
    };
    this.fireEvent(div, "mousedown");
    this.fireEvent(div, "mouseup");
    this.fireEvent(div, "mouseout");
  };
  controller.playPause = function() {
    this.playControlsClick("*[playeraction='togglePlay']");
  };
  controller.playNext = function() {
    this.playControlsClick("*[playeraction='next']");
  };
  controller.playPrev = function() {
    this.playControlsClick("*[playeraction='previous']");
  };
})();
