;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "SoundCloud",
    playPause: ".playControl",
    playNext: ".skipControl__next",
    playPrev: ".skipControl__previous",
    mute: ".volume__iconWrapper",
    like: ".playbackSoundBadge__like",

    playState: ".playControl.playing",
    song: ".playbackSoundBadge__titleContextContainer > a",
    artist: ".playbackSoundBadge__titleContextContainer > .playbackSoundBadge__title > a > span:nth-of-type(2)",

    hidePlayer: true,

    canGetMedia: true
  });

  controller.getMedia = function() {
    var audios = document.querySelectorAll("#skMedias > audio");
    if (audios != undefined) {
      for (var audio of audios) {
        if (audio.src != "") {
          return audio;
        }
      }
    }
  };

  controller.setPosition = function(time) {
    window.postMessage({type: "setPosition", time: time * 1000});
  };

  controller.seek = function(time) {
    window.postMessage({type: "seek", time: time * 1000});
  };

  controller.getCurrentTime = function() {
    return this.hmsToSecondsOnly(
      document.querySelector(".playbackTimeline__timePassed")
        .lastElementChild.textContent) * 1000 * 1000;
  };

  controller.getTotalTime = function() {
    return this.hmsToSecondsOnly(
      document.querySelector(".playbackTimeline__duration")
        .lastElementChild.textContent) * 1000 * 1000;
  };

  var code = `
  window.addEventListener("message", function(event) {
    if (event.source != window) {
      return;
    }
    if (event.data.type == "seek") {
      window.skAudio.sound.seekRelative(event.data.time);
    }
    if (event.data.type == "setPosition") {
      window.skAudio.sound.seek(event.data.time);
    }
  });
  `;
  var script = document.createElement("script");
  script.textContent = code;
  (document.head||document.documentElement).appendChild(script);
  script.remove();
})();
