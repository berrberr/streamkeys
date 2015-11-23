;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.target.id === "pad_wrap") {
        if(mutation.target && mutation.target.style.opacity === "1") {
          console.log("Controls visible");
          observer.disconnect();
          controller.click({selectorButton: controller.selectors.playPause, action: "playPause"});
          controller.click({selectorButton: controller.selectors.hideControls});
          return;
        }
      }
    });
  });

  var controller = new BaseController({
    siteName: "VK",
    playPause: "#pd_play",
    playNext: "#pd_next",
    playPrev: "#pd_prev",

    hidePlayer: true
  });

  controller.selectors.playcontrols = "#pad_cont";
  controller.selectors.loadedPlayPause = "#gp_play";
  controller.selectors.showControls = "#head_music";
  controller.selectors.hideControls = ".pad_close_btn > button";

  // Must have control box open to click the next/prev controls
  controller.playPause = function() {

    // If the control box has already been loaded this play selector will be visible
    if(document.querySelector(this.selectors.loadedPlayPause) !== null) {
      this.click({selectorButton: this.selectors.loadedPlayPause, action: "playPause"});
    }

    // If that selector is not visible then we have to load the control box first
    // It is async so use a mutation observer to wait to click the controls
    else if(document.querySelector(this.selectors.playPause) === null) {
      this.click({selectorButton: this.selectors.showControls, action: "openControls"});
      observer.observe(document.body, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["style"], characterData: false});
    }

    // Fallback - this can happen if the controls box is visible via a user click
    else {
      this.click({selectorButton: this.selectors.playPause, action: "playPause"});
    }
  };

  controller.playNext = function() {
    if(document.querySelector(this.selectors.playcontrols) === null) this.click({selectorButton: this.selectors.showControls, action: "openControls"});
    this.click({selectorButton: this.selectors.playNext, action: "playNext"});
    this.click({selectorButton: this.selectors.hideControls});
  };

  controller.playPrev = function() {
    if(document.querySelector(this.selectors.playcontrols) === null) this.click({selectorButton: this.selectors.showControls, action: "openControls"});
    this.click({selectorButton: this.selectors.playPrev, action: "playPrev"});
    this.click({selectorButton: this.selectors.hideControls});
  };
})();
