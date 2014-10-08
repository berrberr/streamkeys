;(function() {
  "use strict";

  var controller = require("BaseController");

  var checkControls = function(selector, action, count) {
    count = count || 0;
    if(count > 40) return;

    if(document.querySelector(this.selector_playcontrols) === null) {
      window.setTimeout(checkControls.bind(this), 100, selector, action, count + 1);
    } else {
      this.click(selector, action);
      if(document.querySelector(this.selector_playcontrols) !== null) this.click(this.selector_hideControls, "closeControls");
    }
  };

  var observer = new MutationObserver(function(mutations) {
    //console.log(mutations);
    mutations.forEach(function(mutation) {
      if(mutation.target.id === "pad_cont") {
        if(mutation.addedNodes.length > 0) {
          for(var i = 0; i < mutation.addedNodes.length; i++) {
            if(mutation.addedNodes[i].id == "pad_controls") {
              console.log("Controls visible");
              controller.click(controller.selector_playPause, "playPause");
              controller.click(controller.selector_hideControls, "closeControls");
              observer.disconnect();
              return;
            }
          }
        }
      }
    });
  });

  // stop watching using:
  // observer.disconnect()

  controller.init({
    playPause: "#pd_play",
    playNext: "#pd_next",
    playPrev: "#pd_prev"
  });

  controller.selector_playcontrols = "#pad_cont";
  controller.selector_showControls = "#head_music";
  controller.selector_hideControls = ".pad_close_btn > button";

  //Must have control box open to click the next/prev controls
  controller.playPause = function() {
    if(document.querySelector(this.selector_playcontrols) === null) {
      this.click(this.selector_showControls, "openControls");
      observer.observe(document.body, {childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["style"], characterData: false});
    } else {
      this.click(this.selector_playPause, "playPause");
    }
    //window.setTimeout(checkControls.bind(this), 100, this.selector_playPause, "playPause");
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
