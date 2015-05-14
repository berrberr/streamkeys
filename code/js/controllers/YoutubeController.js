;(function() {
  "use strict";

  var controller = require("BaseController"),
      sk_log = require("../modules/SKLog.js");

  controller.init({
    siteName: "YouTube",
    playPause: ".ytp-button-play",
    play: ".ytp-button-play",
    pause: ".ytp-button-pause",
    playNext: ".ytp-button-next",
    playPrev: ".ytp-button-prev",
    mute: ".ytp-button-volume",
    like: "#watch-like",
    dislike: "#watch-dislike",

    playState: ".ytp-button-pause",
    song: ".watch-title",
    buttonSwitch: true
  });

  controller.playNext = function() {
    if(document.querySelector(this.selectors.playNext) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click({selectorButton: this.selectors.playNext, action: "playNext"});
  };

  controller.playPrev = function() {
    if(document.querySelector(this.selectors.playPrev) === null) sk_log("disabled. Playlist selectors not found!");
    else this.click({selectorButton: this.selectors.playPrev, action: "playPrev"});
  };

  controller.click = function(opts) {
    opts = opts || {};
    if(opts.selectorButton === null) {
      sk_log("disabled", opts.action);
      return;
    }

    var doc = (opts.selectorFrame) ? document.querySelector(opts.selectorFrame).contentWindow.document : document;
    if (!doc) return;

    try {
      doc.querySelector(opts.selectorButton).click();
      sk_log(opts.action);
    } catch(e) {
      // If selector fails then we are using the new youtube player
      if(opts.action === "playPause") doc.querySelector(".ytp-play-button").click();
      if(opts.action === "playNext") doc.querySelector(".ytp-next-button").click();
      if(opts.action === "playPrev") doc.querySelector(".ytp-prev-button").click();
    }
  };
})();
