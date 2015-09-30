;(function() {
  "use strict";

  var controller = require("BaseController");

  controller.init({});


  // Must have control box open to click the next/prev controls
  controller.playPause = function() {
    var video=document.getElementsByTagName("video")[0];
    if (video.paused){
      video.play();
    }else{
      video.pause();
    }
  };

  controller.playPrev = function() {
    var video=document.getElementsByTagName("video")[0];
    video.currentTime -=5;
  };

  controller.playNext = function() {
    var video=document.getElementsByTagName("video")[0];
    video.currentTime +=5;
  };

})();
