"use strict";

var $ = require("jquery"),
    ko = require("ko");

var OptionsViewModel = function OptionsViewModel() {
  var self = this;

  self.selectedTab = ko.observable("sites");

  self.sitelistInitialized = ko.observable(false);
  self.settingsInitialized = ko.observable(false);
  self.sitelist = ko.observableArray([]);

  self.loadingComplete = ko.pureComputed(function() {
    return self.sitelistInitialized() && self.settingsInitialized();
  });

  // Load localstorage settings into observables
  chrome.storage.sync.get(function(obj) {
    self.openOnUpdate = ko.observable(obj["hotkey-open_on_update"]);
    self.openOnUpdate.subscribe(function(value) {
      chrome.storage.sync.set({ "hotkey-open_on_update": value });
    });

    self.youtubeRestart = ko.observable(obj["hotkey-youtube_restart"]);
    self.youtubeRestart.subscribe(function(value) {
      chrome.storage.sync.set({ "hotkey-youtube_restart": value });
    });

    self.settingsInitialized(true);
  });

  self.sitelistChanged = function(site) {
    if(self.sitelistInitialized()) {

      chrome.runtime.sendMessage({
        action: "update_site_settings",
        siteKey: site.id,
        siteState: {
          enabled: site.enabled.peek(),
          priority: site.priority.peek()
        }
      });
    }
  };

  chrome.runtime.sendMessage({ action: "get_sites" }, function(response) {
    $.each(response, function(key, val) {
      var site = new MusicSite({
        id: key,
        name: val.name,
        enabled: val.enabled,
        priority: val.priority
      });
      site.enabled.subscribe(() => self.sitelistChanged(site));
      site.priority.subscribe(() => self.sitelistChanged(site));
      self.sitelist.push(site);
    });

    self.sitelistInitialized(true);
  });
};

var MusicSite = (function() {
  function MusicSite(attributes) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.enabled = ko.observable(attributes.enabled);
    this.priority = ko.observable(attributes.priority);

    this.toggleSite = function() {
      this.enabled(!this.enabled.peek());
    };
  }

  return MusicSite;
})();

document.addEventListener("DOMContentLoaded", function() {
  ko.applyBindings(new OptionsViewModel());
});
