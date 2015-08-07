"use strict";

var $ = require("jquery"),
    ko = require("ko"),
    _ = require("lodash");
require("../lib/jquery.marquee.js");

var PopupViewModel = function PopupViewModel() {
  var self = this;

  self.musicTabsLoaded = ko.observable(false);
  self.musicTabs = ko.observableArray([]);
  // Filter hidden players and sort by siteName -> tabId
  self.sortedMusicTabs = ko.computed(function() {
    return _.sortByAll(
      _.filter(self.musicTabs(), function(tab) {
        return (tab.canPlayPause() || !tab.hidePlayer);
      }),
    ["siteName", "tabId"]);
  });

  self.visibleMusicTabs = ko.observableArray([]);
  self.optionsUrl = ko.observable(chrome.runtime.getURL("html/options.html"));

  // Send a request to get the player state of every active music site tab
  chrome.runtime.sendMessage({ action: "get_music_tabs" }, self.getTabStates.bind(this));

  // Setup listener for updating the popup state
  chrome.runtime.onMessage.addListener(function(request) {
    if(request.action === "update_popup_state" && request.stateData) self.updateState(request.stateData, request.fromTab);
  });
};

PopupViewModel.prototype.updateState = function(stateData, tab) {
  if(typeof stateData == "undefined") return false;

  if(!this.musicTabsLoaded.peek()) this.musicTabsLoaded(true);

  console.log("Update state: ", stateData, tab, tab.id);
  var musicTab = _.findWhere(this.musicTabs(), { tabId: tab.id });
  console.log("The music tab: ", musicTab);
  if(musicTab) {
    // Update observables
    _.forEach(musicTab.observableProperties, function(property) {
      if(typeof stateData[property] !== "undefined") musicTab[property](stateData[property]);
    });
  }
  else {
    console.log("Init enabled state: ", tab.streamkeysEnabled);
    musicTab = new MusicTab(_.assign(stateData, {
      tabId: tab.id,
      faviconUrl: tab.favIconUrl,
      streamkeysEnabled: typeof tab.streamkeysEnabled !== "undefined" ? tab.streamkeysEnabled : true
    }));

    console.log("After creation enabled: ", musicTab.streamkeysEnabled());
    this.musicTabs.push(musicTab);
  }
};

/**
 * Query each active music tab for the player state, then update the popup state
 * @param {Array} tabs - array of active music tabs
 */
PopupViewModel.prototype.getTabStates = function(tabs) {
  var that = this;
  console.log("Tab states from background: ", tabs);

  _.forEach(tabs, function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: "getPlayerState" }, (function(playerState) {
      that.updateState(playerState, this.tab);
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
    this.showTabSettings = ko.observable(false);

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
      console.log("marking site as disabled: ", this.streamkeysEnabled.peek());
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
