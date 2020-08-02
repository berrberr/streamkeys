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
    document.querySelector(".SaveVideoButton").click()
  }

  controller.mute = function(){
    this.showControls();
    document.querySelector(".PlayerControls-icon--mute").click()
  }

  controller.isPlaying = function(){
    return !document.querySelector(".PausePlayButton") ? true : false;
  }
})();
