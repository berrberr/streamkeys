"use strict";

var $ = require("jquery"),
    ko = require("ko"),
    _ = require("lodash");
require("../lib/jquery.marquee.js");

var PopupViewModel = function PopupViewModel() {
  var self = this;

  self.totalMusicTabs = ko.observable(1);
  self.musicTabsLoaded = ko.observable(0);
  self.musicTabs = ko.observableArray([]);
  // Tabs from disabled music sites to show in disabled list toggle
  self.disabledMusicTabs = ko.observableArray([]);
  self.disabledSitesOpen = ko.observable(false);

  // Filter hidden players and sort by siteName -> tabId
  self.sortedMusicTabs = ko.computed(function() {
    return _.sortByAll(
      _.filter(self.musicTabs(), function(tab) {
        return (tab.canPlayPause() || !tab.hidePlayer);
      }),
    ["siteName", "tabId"]);
  });

  self.isLoaded = ko.computed(function() {
    return self.musicTabsLoaded() == self.totalMusicTabs();
  });

  self.visibleMusicTabs = ko.observableArray([]);
  self.optionsUrl = ko.observable(chrome.runtime.getURL("html/options.html"));

  self.openOptionsPage = function() {
    window.open(self.optionsUrl());
  };

  // Send a request to get the player state of every active music site tab
  chrome.runtime.sendMessage({ action: "get_music_tabs" }, self.getTabStates.bind(this));

  // Setup listener for updating the popup state
  chrome.runtime.onMessage.addListener(function(request) {
    if(request.action === "update_popup_state" && request.stateData) self.updateState(request.stateData, request.fromTab);
  });
};

PopupViewModel.prototype.updateState = function(stateData, tab, disabled) {
  if(typeof stateData == "undefined") return false;

  var musicTab = _.findWhere(
    _.union(this.musicTabs.peek(), this.disabledMusicTabs.peek()),
    { tabId: tab.id }
  );

  if(musicTab) {
    // Update observables
    _.forEach(musicTab.observableProperties, function(property) {
      if(typeof stateData[property] !== "undefined") musicTab[property](stateData[property]);
    });
  } else {
    // Create new tab
    musicTab = new MusicTab(_.assign(stateData, {
      tabId: tab.id,
      faviconUrl: tab.favIconUrl,
      streamkeysEnabled: typeof tab.streamkeysEnabled !== "undefined" ? tab.streamkeysEnabled : true
    }));

    if(disabled) {
      this.disabledMusicTabs.push(musicTab);
    } else {
      this.musicTabs.push(musicTab);
    }
  }
};

/**
 * Query each active music tab for the player state, then update the popup state
 * @param {Array} tabs - array of active music tabs
 */
PopupViewModel.prototype.getTabStates = function(tabs) {
  var that = this;
  that.totalMusicTabs(tabs.enabled.length + tabs.disabled.length);

  _.forEach(tabs.enabled, function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: "getPlayerState" }, (function(playerState) {
      that.updateState(playerState, this.tab);
      that.musicTabsLoaded(that.musicTabsLoaded.peek() + 1);
    }).bind({ tab: tab }));
  });

  _.forEach(tabs.disabled, function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: "getPlayerState" }, (function(playerState) {
      that.updateState(playerState, this.tab, true);
      that.musicTabsLoaded(that.musicTabsLoaded.peek() + 1);
    }).bind({ tab: tab }));
  });
};

var MusicTab = (function() {
  function MusicTab(attributes) {
    this.observableProperties = [
      "song",
      "artist",
      "streamkeysEnabled",
      "isPlaying",
      "canPlayPause",
      "canPlayNext",
      "canPlayPrev",
      "canLike",
      "canDislike"
    ];

    _.assign(this, attributes);

    /** Override observables **/
    _.forEach(this.observableProperties, function(property) {
      this[property] = ko.observable(typeof attributes[property] !== "undefined" ? attributes[property] : null);
    }, this);

    /** Popup specific observables **/
    this.songArtistText = ko.pureComputed(function() {
      if(!this.song()) return "";

      return (this.artist()) ? this.artist() + " - " + this.song() : this.song();
    }, this);

    this.sendAction = function(action) {
      chrome.runtime.sendMessage({
        action: "command",
        command: action,
        tab_target: this.tabId
      });
    };

    this.openTab = function() {
      chrome.tabs.update(parseInt(this.tabId), { selected: true });
    };

    this.toggleStreamkeysEnabled = function() {
      this.streamkeysEnabled(!this.streamkeysEnabled.peek());
      chrome.extension.getBackgroundPage().window.sk_sites.markTabEnabledState(this.tabId, this.streamkeysEnabled.peek());
    };
  }

  return MusicTab;
})();

document.addEventListener("DOMContentLoaded", function() {
  window.popup = new PopupViewModel();

  ko.applyBindings(window.popup);

  ko.bindingHandlers.scrollingSong = {
    update: function(element, valueAccessor) {
      $(element).text(ko.unwrap(valueAccessor()));
      if($(element).outerWidth() > $("#player").width()) {
        // Remove any old marquees
        $(element).marquee("destroy");
        var scrollDuration = (parseInt($(element).outerWidth()) * 15);

        $(element).bind("finished", function() {
          $(this).find(".js-marquee-wrapper").css("margin-left", "0px");
        }).marquee({
          allowCss3Support: false,
          delayBeforeStart: 2500,
          duration: scrollDuration,
          pauseOnCycle: true
        });
      }
    }
  };
});
