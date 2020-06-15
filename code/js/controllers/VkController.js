"use strict";
(function() {
  var sk_log = require("../modules/SKLog.js"),
    MouseEventController = require("MouseEventController"),
    SimpleMutationObserver = require("../modules/SimpleMutationObserver.js"),
    selectors,
    controller,
    vkObserver;

  // if new ui detected
  if (document.getElementById("top_notify_btn")) {
    sk_log("[VK] New ui detected");

    selectors = {
      headerPlayer: "#top_audio_player",
      headerPlayerEnabled: "#top_audio_player.top_audio_player_enabled",
      headerPlayerIcon: "#top_audio",
      playerPanelPlay: ".audio_page_player_play"
    };

    controller = new MouseEventController({
      siteName: "VK Music",

      playPause: "#top_audio_player.top_audio_player_enabled .top_audio_player_play",
      playNext: "#top_audio_player.top_audio_player_enabled .top_audio_player_next",
      playPrev: "#top_audio_player.top_audio_player_enabled .top_audio_player_prev",

      playState: "#top_audio_player.top_audio_player_enabled.top_audio_player_playing",
      song: "#top_audio_player.top_audio_player_enabled .top_audio_player_title"
    });

    vkObserver = new SimpleMutationObserver(controller.doc());

    // overrides
    controller.playPause = function() {
      var self = this;

      // if player on header enabled call super and return
      if (vkObserver.isEnabled(selectors.headerPlayerEnabled)) {
        return MouseEventController.prototype.playPause.call(self);
      }
      // if play button enabled (e.g. current page it's music) start playing and return
      if (vkObserver.isEnabled(selectors.playerPanelPlay)) {
        return self.click({ selectorButton: selectors.playerPanelPlay });
      }

      // listen when player initialized
      vkObserver.once(selectors.playerPanelPlay, "inserted", function() {
        self.click({ selectorButton: selectors.playerPanelPlay }); // start playing
        self.mousedown({ selectorButton: selectors.headerPlayer }); // hide player panel
      });

      // player initialization, click does not work
      // first need mouseover, and then mousedown
      self.mouseover({ selectorButton: selectors.headerPlayerIcon });
      self.mousedown({ selectorButton: selectors.headerPlayerIcon });
    };
  }

  // if new ui not detected
  else {
    sk_log("[VK] New ui not detected");

    selectors = {
      headerPlayButton: "#head_play_btn",
      playerPanel: "#gp",
      playerPanelInfo: "#gp_info",
      playerPanelNext: "#pd_next",
      playerPanelPrev: "#pd_prev"
    };

    controller = new MouseEventController({
      siteName: "VK Music",
      playPause: "#gp_play",
      playNext: selectors.playerPanelNext,
      playPrev: selectors.playerPanelPrev,

      playState: "#gp_play.playing",
      artist: "#gp_performer",
      song: "#gp_title"
    });

    vkObserver = new SimpleMutationObserver(controller.doc());

    // click on initSelector, wait when waitSelector will be inserted,
    // click on waitSelector if needed and close player panel
    controller.initWaitAndClose = function(waitSelector, initSelector, clickOnWaitSelector) {
      var self = this;

      // default init player panel from header button
      waitSelector = waitSelector || selectors.playerPanelInfo;
      initSelector = initSelector || selectors.headerPlayButton;

      vkObserver.once(waitSelector, "inserted", function() {
        if (clickOnWaitSelector) {
          self.click({ selectorButton: waitSelector });
        }
        self.click({ selectorButton: selectors.playerPanelInfo }); // hide player
      });
      self.click({ selectorButton: initSelector });
    };

    // overrides
    controller.playPause = function() {
      var self = this;
      // if player panel enabled call super method and return
      if (vkObserver.isEnabled(selectors.playerPanel)) {
        return MouseEventController.prototype.playPause.call(self);
      }
      // initialize player panel
      self.initWaitAndClose();
    };

    controller.playNext = function() {
      var self = this;
      // if player panel already opened call super method and return
      if (vkObserver.isEnabled(selectors.playerPanelNext)) {
        return MouseEventController.prototype.playNext.call(self);
      }
      // open player panel, click next button, close player panel
      self.initWaitAndClose(selectors.playerPanelNext, selectors.playerPanelInfo, true);
    };

    controller.playPrev = function() {
      var self = this;
      // if player panel already opened call super method and return
      if (vkObserver.isEnabled(selectors.playerPanelPrev)) {
        return MouseEventController.prototype.playPrev.call(self);
      }
      // open player panel, click prev button, close player panel
      self.initWaitAndClose(selectors.playerPanelPrev, selectors.playerPanelInfo, true);
    };

    controller.getStateData = function() {
      var result = MouseEventController.prototype.getStateData.call(this); // call super
      // if player panel enabled activate prev/next buttons
      if (vkObserver.isEnabled(selectors.playerPanel)) {
        result.canPlayPrev = true;
        result.canPlayNext = true;
      }
      return result;
    };
  }
})();
