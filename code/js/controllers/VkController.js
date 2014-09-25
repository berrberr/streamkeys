;(function() {
  "use strict";

  var controller = require("BaseController").init({
    playPause: "#head_play_btn",
    playNext: ".next.ctrl",
    playPrev: ".prev.ctrl"
  });

  controller.selector_controlbox = "#head_music";

  //Must have control box open to click the next/prev controls
  controller.playNext = function() {
    this.click(this.selector_controlbox);
    this.click(this.selector_playNext);
    this.click(this.selector_controlbox);
  };
  controller.playPrev = function() {
    this.click(this.selector_controlbox);
    this.click(this.selector_playPrev);
    this.click(this.selector_controlbox);
  };
})();
