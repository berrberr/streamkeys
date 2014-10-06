;(function() {
  "use strict";

  var controller = require("BaseController");
  var checkControls = function(selector, action) {
    if(document.querySelector(this.selector_playcontrols) === null) {
      window.setTimeout(checkControls.bind(this), 100, selector, action);
    } else {
      this.click(selector, action);
      this.click(this.selector_hideControls, "closeControls");
    }
  };

  controller.init({
    playPause: "#pd_play",
    playNext: "#pd_next",
    playPrev: "#pd_prev"
  });

  controller.selector_playcontrols = "#pad_controls";
  controller.selector_showControls = "#head_music";
  controller.selector_hideControls = ".pad_close_btn > button";


  //Must have control box open to click the next/prev controls
  controller.playPause = function() {
    if(document.querySelector(this.selector_playcontrols) === null) this.click(this.selector_showControls, "openControls");
    window.setTimeout(checkControls.bind(this), 100, this.selector_playPause, "playPause");
  };
  controller.playNext = function() {
    if(document.querySelector(this.selector_playcontrols) === null) this.click(this.selector_showControls, "openControls");
    this.click(this.selector_playNext, "playNext");
    this.click(this.selector_hideControls, "closeControls");
  };
  controller.playPrev = function() {
    if(document.querySelector(this.selector_playcontrols) === null) this.click(this.selector_showControls, "openControls");
    this.click(this.selector_playPrev, "playPrev");
    this.click(this.selector_hideControls, "closeControls");
  };
})();
