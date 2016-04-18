;(function() {
  "use strict";

  // DOM state listener
  var DOMState = function (controller) {
    var self = this;

    self.selectors = {};
    self.inserted = {};
    self.removed = {};

    self.controller = controller;
    self.document = controller.doc();

    self.observer = new MutationObserver(function() {
      for (var selector in self.selectors) {
        var oldState = self.isEnabled(selector);
        var newState = self.checkEnabled(selector);
        self.selectors[selector] = newState;

        if (oldState != newState) {
          if (newState) {
            self.inserted[selector] = self.inserted[selector].filter(function(handler) {return handler() !== false;});
          }
          else {
            self.removed[selector] = self.removed[selector].filter(function(handler) {return handler() !== false;});
          }
        }
      }
    });

    self.observer.observe(self.document.body, {childList: true, subtree: true, attributes: true});
  };

  DOMState.prototype.checkEnabled = function(selector) {
    return Boolean(this.document.querySelector(selector));
  };

  DOMState.prototype.isEnabled = function(selector) {
    return Boolean(this.selectors[selector]);
  };

  DOMState.prototype.addSelector = function(selector) {
    if (!this.selectors.hasOwnProperty(selector)) {
      this.selectors[selector] = this.checkEnabled(selector);
      this.inserted[selector] = [];
      this.removed[selector] = [];
    }
  };

  DOMState.prototype.onInserted = function(selector, handler) {
    this.addSelector(selector);
    this.inserted[selector].push(handler);
  };

  DOMState.prototype.onRemoved = function(selector, handler) {
    this.addSelector(selector);
    this.removed[selector].push(handler);
  };


  var simulateMouseEvent = function(event) {
    return function(selector) {
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(event, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      var cb = document.querySelector(selector);
      cb.dispatchEvent(evt);
    };
  };


  var simulateOver = simulateMouseEvent("mouseover");
  var simulateDown = simulateMouseEvent("mousedown");

  var sk_log = require("../modules/SKLog.js");
  var BaseController = require("BaseController");
  var controller, vkState;


  // New ui
  if (document.getElementById("top_notify_btn")) {
    sk_log("[VK] New ui detected");

    controller = new BaseController({
      siteName: "VK Music",

      playPause: "#top_audio_player.top_audio_player_enabled .top_audio_player_play",
      playNext: "#top_audio_player.top_audio_player_enabled .top_audio_player_next",
      playPrev: "#top_audio_player.top_audio_player_enabled .top_audio_player_prev",

      playState: "#top_audio_player.top_audio_player_enabled.top_audio_player_playing",
      song: "#top_audio_player.top_audio_player_enabled .top_audio_player_title"
    });

    vkState = new DOMState(controller);
    vkState.addSelector("#top_audio_player.top_audio_player_enabled");

    controller.playPause = function() {
      var self = this;
      if (vkState.isEnabled("#top_audio_player.top_audio_player_enabled")) {
        return BaseController.prototype.playPause.call(self); // call super
      }
      // Hide pad after player initialization
      var playSelector = "#audio_layer_tt > ._audio_layer > ._audio_page_player > .audio_play_wrap";
      vkState.onInserted(playSelector, function() {
        self.click({selectorButton: playSelector});
        self.click({selectorButton: "#top_audio_player"});
        return false; // once
      });

      // Audio player initializer
      simulateOver("#top_audio");
      simulateDown("#top_audio");
    };
  }

  // Old ui
  else {
    sk_log("[VK] New ui not detected");

    controller = new BaseController({
      siteName: "VK Music",
      playPause: "#gp_play",
      playNext: "#pd_next",
      playPrev: "#pd_prev",

      playState: "#gp_play.playing",
      artist: "#gp_performer",
      song: "#gp_title"
    });

    vkState = new DOMState(controller);
    vkState.addSelector("#gp");
    vkState.addSelector("#pd_next");
    vkState.addSelector("#pd_prev");

    controller.playPause = function() {
      var self = this;
      if (vkState.isEnabled("#gp")) {
        return BaseController.prototype.playPause.call(self); // call super
      }
      // Hide pad after player initialization
      vkState.onInserted("#gp_info", function() {
        self.click({selectorButton: "#gp_info"});
        return false; // once
      });
      // Audio player initializer
      self.click({selectorButton: "#head_play_btn"});
    };

    controller.playNext = function() {
      var self = this;
      if (vkState.isEnabled("#pd_next")) {
        return BaseController.prototype.playNext.call(self); // call super
      }
      // After pad enabled switch track and close pad
      vkState.onInserted("#pd_next", function() {
        self.click({selectorButton: "#pd_next"});
        self.click({selectorButton: "#gp_info"});
        return false; // once
      });
      // Open pad unless already opened
      self.click({selectorButton: "#gp_info"});
    };

    controller.playPrev = function() {
      var self = this;
      if (vkState.isEnabled("#pd_prev")) {
        return BaseController.prototype.playPrev.call(self); // call super
      }
      // After pad enabled switch track and close pad
      vkState.onInserted("#pd_prev", function() {
        self.click({selectorButton: "#pd_prev"});
        self.click({selectorButton: "#gp_info"});
        return false; // once
      });
      // Open pad unless already opened
      self.click({selectorButton: "#gp_info"});
    };

    controller.getStateData = function() {
      var self = this;
      var result = BaseController.prototype.getStateData.call(self); // call super
      if (vkState.isEnabled("#gp")) {
        result.canPlayPrev = true;
        result.canPlayNext = true;
      }
      return result;
    };
  }
})();
