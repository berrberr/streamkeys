"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Neverthink",
    playState: ".PlayerControls-middleButtons",
    song: ".HiddenVideoTitle",
    album: ".VideoCreator-name",

    mute: ".PlayerControls-icon--mute",
    like: ".SaveVideoButton",

    overridePlayPause: true,
    overridePlayPrev: true,
    overridePlayNext: true,
  });

  controller.showControls = function(){
    if(!document.querySelector(".PausePlayButton")){
      document.querySelector(".PlayerControls-mouseListenerLayer").dispatchEvent(new Event("mousemove", {bubbles: true}))
    }
  }
  controller.playPause = function(){
    this.showControls();
    document.querySelector(".PausePlayButton").click()
  }

  controller.playPrev = function(){
    this.showControls();
    document.querySelector(".PreviousVideoButton").click()
  }

  controller.playNext = function(){
    this.showControls();
    document.querySelector(".NextVideoButton").click()
  }

  controller.like = function(){
    this.showControls();
    var save_button = document.querySelector(".SaveVideoButton");

    save_button.click();

    // Dislike the video
    if(save_button.classList.contains("SaveVideoButton--saved")){
      setTimeout(function(){
        document.querySelector(".Popup-options>div").click()
      }, 100);
    }
  }

  controller.mute = function(){
    this.showControls();
    document.querySelector(".PlayerControls-icon--mute").click()
  }

  controller.isPlaying = function(){
    return !document.querySelector(".PausePlayButton") ? true : false;
  }
})();
