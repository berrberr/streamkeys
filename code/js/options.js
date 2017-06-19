"use strict";

var $ = require("jquery"),
  ko = require("ko");
require("./lib/material.min.js");

var OptionsViewModel = function OptionsViewModel() {
  var self = this;

  self.selectedTab = ko.observable("sites");

  self.sitelistInitialized = ko.observable(false);
  self.settingsInitialized = ko.observable(false);
  self.sitelist = ko.observableArray([]);
  self.commandList = ko.observableArray([]);

  self.loadingComplete = ko.pureComputed(function() {
    return self.sitelistInitialized() && self.settingsInitialized();
  });

  chrome.commands.getAll(function(commands) {
    self.commandList(commands);
  });

  self.openExtensionKeysPage = function() {
    chrome.tabs.create({
      url: "chrome://extensions/configureCommands"
    });
  };

  // Load localstorage settings into observables
  chrome.storage.sync.get(function(obj) {
    self.openOnUpdate = ko.observable(obj["hotkey-open_on_update"]);
    self.openOnUpdate.subscribe(function(value) {
      chrome.storage.sync.set({
        "hotkey-open_on_update": value
      });
    });

    self.youtubeRestart = ko.observable(obj["hotkey-youtube_restart"]);
    self.youtubeRestart.subscribe(function(value) {
      chrome.storage.sync.set({
        "hotkey-youtube_restart": value
      });
    });

    self.settingsInitialized(true);
  });

  self.sitelistChanged = function(site) {
    if (self.sitelistInitialized()) {
      chrome.runtime.sendMessage({
        action: "update_site_settings",
        siteKey: site.id,
        siteState: {
          enabled: site.enabled.peek(),
          priority: site.priority.peek(),
          alias: site.alias.peek(),
          removedAlias: site.removedAlias
        }
      });
    }
  };

  chrome.runtime.sendMessage({
    action: "get_sites"
  }, function(response) {
    $.each(response, function(key, val) {
      var site = new MusicSite({
        id: key,
        name: val.name,
        enabled: val.enabled,
        priority: val.priority,
        alias: val.alias
      });

      site.enabled.subscribe(function() {
        self.sitelistChanged(site);
      });
      site.priority.subscribe(function() {
        self.sitelistChanged(site);
      });
      site.alias.subscribe(function() {
        self.sitelistChanged(site);
      });

      self.sitelist.push(site);
    });

    self.sitelistInitialized(true);
  });
};

var MusicSite = (function() {
  function MusicSite(attributes) {
    var self = this;

    self.id = attributes.id;
    self.sanitizedId = attributes.id.replace(/[\.,"']/g, "");
    self.name = attributes.name;
    self.enabled = ko.observable(attributes.enabled);
    self.priority = ko.observable(attributes.priority);
    self.alias = ko.observableArray(attributes.alias || []);
    self.removedAlias = [];
    self.aliasText = ko.observable("");

    self.toggleSite = function() {
      self.enabled(!self.enabled.peek());
    };

    /**
     * Note: It's possible some validation should be added to check if alias is proper domain.
     *    However, since it is user input and can be deleted it's probably not worth it.
     */
    self.addAlias = function() {
      self.removedAlias = [];
      self.alias.push(self.aliasText.peek());
      self.aliasText("");
    };

    self.removeAlias = function(index) {
      var aliasToRemove = self.alias.peek()[index()];

      self.removedAlias = [aliasToRemove];
      self.alias.remove(aliasToRemove);
    };
  }

  return MusicSite;
})();

document.addEventListener("DOMContentLoaded", function() {
  ko.applyBindings(new OptionsViewModel());

  ko.bindingHandlers.priorityDropdown = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var value = valueAccessor();

      element.id = bindingContext.$data.sanitizedId;

      var $ul = $("<ul>")
        .addClass("mdl-menu mdl-js-menu mdl-js-ripple-effect")
        .attr("for", bindingContext.$data.sanitizedId);

      var updatePriority = function() {
        value(parseInt($(this).attr("data-value")));
      };

      for (var idx = 1; idx <= 9; idx++) {
        // add each item to the list
        var $li = $("<li>")
          .addClass("mdl-menu__item")
          .text(idx)
          .attr("data-value", idx)
          .on("click", updatePriority);

        $($ul).append($li);
      }

      $(element).after($ul);

      window.componentHandler.upgradeElement($($ul)[0]);
      window.componentHandler.upgradeElement(element);
    }
  };

  ko.bindingHandlers.aliasModal = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var dialog = document.querySelector("#modal-" + bindingContext.$data.sanitizedId);
      var closeButton = dialog.querySelector(".close-button");
      var showButton = element;

      var closeClickHandler = function() {
        dialog.close();
      };

      var showClickHandler = function() {
        dialog.showModal();
      };

      showButton.addEventListener("click", showClickHandler);
      closeButton.addEventListener("click", closeClickHandler);
    }
  };
});
