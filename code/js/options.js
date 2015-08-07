"use strict";

var $ = require("jquery"),
    ko = require("ko"),
    _ = require("lodash");

var OptionsViewModel = function OptionsViewModel() {
  var self = this;

  self.selectedTab = ko.observable("sites");

  self.sitelistInitialized = ko.observable(false);
  self.settingsInitialized = ko.observable(false);
  self.sitelist = ko.observableArray([]);

  // Load localstorage settings into observables
  chrome.storage.local.get(function(obj) {
    self.openOnUpdate = ko.observable(obj["hotkey-open_on_update"]);
    self.openOnUpdate.subscribe(function(value) {
      chrome.storage.local.set({ "hotkey-open_on_update": value });
    });

    self.settingsInitialized(true);
  });

  self.sitelistChanged = function() {
    console.log("sitelist changed", self.sitelistInitialized());
    if(self.sitelistInitialized()) {
      var formattedSites = _.object(
        _.pluck(self.sitelist(), "id"),
        _.map(self.sitelist(), function(site) { return site.enabled.peek(); })
      );
      console.log("new sites: ", formattedSites);
      chrome.storage.local.set({"hotkey-sites": formattedSites}, function() {
        chrome.runtime.sendMessage({ action: "update_keys" });
      });
    }
  };

  chrome.runtime.sendMessage({ action: "get_sites" }, function(response) {
    $.each(response, function(key, val) {
      var site = new MusicSite({
        id: key,
        name: val.name,
        enabled: val.enabled
      });
      site.enabled.subscribe(self.sitelistChanged);
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

    this.toggleSite = function() {
      this.enabled(!this.enabled.peek());
    };
  }

  return MusicSite;
})();

document.addEventListener("DOMContentLoaded", function() {
  ko.applyBindings(new OptionsViewModel());
});
