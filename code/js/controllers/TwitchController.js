;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Twitch.tv",
    playPause: ".qa-pause-play-button",
    song: ".title .real"
  });

  controller.isPlaying = function() {
    return !!(this.doc().querySelector("span[data-tip='Pause']"));
  };

  controller.getVolume = function() {
    var videos = document.getElementsByTagName("video");
    if(videos.length > 0) {
      return videos[0].volume;
    }
    return 1;
};

  controller.setVolume = function(volume) {
    var videos = document.getElementsByTagName("video");
    if(videos.length > 0) {
      videos[0].volume = volume;
    }
};

})();
