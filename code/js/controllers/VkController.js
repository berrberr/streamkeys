;(function() {
  "use strict";

  var controller = require("BaseController");

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.target.id === "pad_wrap") {
        if(mutation.target && mutation.target.style.opacity === "1") {
          console.log("Controls visible");
          observer.disconnect();
          controller.click({selectorButton: controller.selector_playPause, action: "playPause"});
          controller.click({selectorButton: controller.selector_hideControls});
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
      this.click({selectorButton: this.selector_loadedPlayPause, action: "playPause"});
    }

    // If that selector is not visible then we have to load the control box first
    // It is async so use a mutation observer to wait to click the controls
    else if(document.querySelector(this.selector_playPause) === null) {
      this.click({selectorButton: this.selector_showControls, action: "openControls"});
      observer.observe(document.body, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["style"], characterData: false});
    }

    // Fallback - this can happen if the controls box is visible via a user click
    else {
      this.click({selectorButton: this.selector_playPause, action: "playPause"});
    }
  };
  controller.playNext = function() {
    if(document.querySelector(this.selector_playcontrols) === null) this.click({selectorButton: this.selector_showControls, action: "openControls"});
    this.click({selectorButton: this.selector_playNext, action: "playNext"});
    this.click({selectorButton: this.selector_hideControls});
  };
  controller.playPrev = function() {
    if(document.querySelector(this.selector_playcontrols) === null) this.click({selectorButton: this.selector_showControls, action: "openControls"});
    this.click({selectorButton: this.selector_playPrev, action: "playPrev"});
    this.click({selectorButton: this.selector_hideControls});
  };
})();
