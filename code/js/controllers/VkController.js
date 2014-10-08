;(function() {
  "use strict";

  var controller = require("BaseController");

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.target.id === "pad_wrap") {
        if(mutation.target && mutation.target.style.opacity === "1") {
          console.log("Controls visible");
          observer.disconnect();
          controller.click(controller.selector_playPause, "playPause");
          controller.click(controller.selector_hideControls, "closeControls");
          return;
        }
      }
    });
  });

  controller.init({
    playPause: "#pd_play",
    playNext: "#pd_next",
    playPrev: "#pd_prev"
  });

  controller.selector_playcontrols = "#pad_cont";
  controller.selector_loadedPlayPause = "#gp_play";
  controller.selector_showControls = "#head_music";
  controller.selector_hideControls = ".pad_close_btn > button";

  // Must have control box open to click the next/prev controls
  controller.playPause = function() {

    // If the control box has already been loaded this play selector will be visible
    if(document.querySelector(this.selector_loadedPlayPause) !== null) {
      this.click(this.selector_loadedPlayPause, "playPause");
    }

    // If that selector is not visible then we have to load the control box first
    // It is async so use a mutation observer to wait to click the controls
    else if(document.querySelector(this.selector_playPause) === null) {
      this.click(this.selector_showControls, "openControls");
      observer.observe(document.body, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["style"], characterData: false});
    }

    // Fallback - this can happen if the controls box is visible via a user click
    else {
      this.click(this.selector_playPause, "playPause");
    }
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
