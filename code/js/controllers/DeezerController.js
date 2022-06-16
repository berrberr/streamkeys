"use strict";
(function () {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Deezer",

    playPrev: "",
    playPause: "",
    playNext: "",
    playState: "",
    dislike: "",
    mute: "",

    song: "a.track-link:nth-of-type(1)",
    artist: "a.track-link:nth-of-type(2)"
  });

  controller.playPrev = function () {
    document.querySelector("[data-testid='StepBackwardIcon']").closest("button").click();
  };

  controller.playPause = function () {
    document.querySelector("div.player-controls [data-testid='PauseIcon'], div.player-controls [data-testid='PlayIcon']").closest("button").click();
  };

  controller.playNext = function () {
    document.querySelector("[data-testid='StepForwardIcon']").closest("button").click();
  };

  controller.like = function () {
    document.querySelector("div.player-track [data-testid='HeartIcon'], div.player-track [data-testid='HeartFillIcon']").closest("button").click();
  };

  controller.dislike = function () {
    if (!document.querySelector("[data-testid='NoteBanIcon']")) {
      document.querySelector("[data-testid='AngryIcon']").closest("button").click();
    }
    document.querySelector("[data-testid='NoteBanIcon']").closest("button").click();
  };

  controller.mute = function () {
    document.querySelector("[data-testid='VolumeIcon'], [data-testid='VolumeMuteIcon']").closest("button").click();
  };
})();
