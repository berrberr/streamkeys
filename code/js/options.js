"use strict";

var ko = require("ko");
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

  chrome.runtime.getPlatformInfo(function(platformInfo) {
    self.supportsMPRIS = platformInfo.os === chrome.runtime.PlatformOs.LINUX;
  });

  // Load localstorage settings into observables
  chrome.storage.sync.get(function(obj) {
    self.openOnUpdate = ko.observable(obj["hotkey-open_on_update"]);
    self.openOnUpdate.subscribe(function(value) {
      chrome.storage.sync.set({ "hotkey-open_on_update": value });
    });

    self.useMPRIS = ko.observable(obj["hotkey-use_mpris"]);
    self.useMPRIS.subscribe(function(value) {
      if (value) {
        chrome.permissions.contains(
          {
            permissions: ["nativeMessaging"]
          },
          function(alreadyHaveNativeMessagingPermissions) {
            if (alreadyHaveNativeMessagingPermissions) {
              chrome.storage.sync.set({ "hotkey-use_mpris": value });
            } else {
              chrome.permissions.request(
                {
                  permissions: ["nativeMessaging"]
                },
                function(granted) {
                  chrome.storage.sync.set({ "hotkey-use_mpris": granted });
                }
              );
            }
          }
        );
      } else {
        chrome.storage.sync.set({ "hotkey-use_mpris": value });
      }
    });

    self.youtubeRestart = ko.observable(obj["hotkey-youtube_restart"]);
    self.youtubeRestart.subscribe(function(value) {
      chrome.storage.sync.set({ "hotkey-youtube_restart": value });
    });

    self.singlePlayerMode = ko.observable(obj["hotkey-single_player_mode"]);
    self.singlePlayerMode.subscribe(function(value) {
      chrome.storage.sync.set({ "hotkey-single_player_mode": value });
      if (!value) self.useMPRIS(false);
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
          showNotifications: site.showNotifications.peek(),
          removedAlias: site.removedAlias
        }
      });
    }
  };

  chrome.runtime.sendMessage({ action: "get_sites" }, function(response) {
    Object.keys(response).forEach(function(key) {
      const siteData = response[key];

      var site = new MusicSite({
        id: key,
        name: siteData.name,
        enabled: siteData.enabled,
        priority: siteData.priority,
        alias: siteData.alias,
        showNotifications: siteData.showNotifications
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
      site.showNotifications.subscribe(function() {
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
    self.showNotifications = ko.observable(attributes.showNotifications);
    self.removedAlias = [];
    self.aliasText = ko.observable("");

    self.toggleSite = function() {
      self.enabled(!self.enabled.peek());
    };

    self.toggleNotifications = function() {
      var internalToggleNotifications = function() {
        self.showNotifications(!self.showNotifications.peek());
      };

      chrome.permissions.contains(
        {
          permissions: ["notifications"],
          origins: ["http://*/*", "https://*/*"]
        },
        function(alreadyHaveNotificationsPermissions) {
          if (alreadyHaveNotificationsPermissions) {
            internalToggleNotifications();
          } else {
            chrome.permissions.request(
              {
                permissions: ["notifications"],
                origins: ["http://*/*", "https://*/*"]
              },
              function(granted) {
                if (granted) {
                  internalToggleNotifications();
                }
              }
            );
          }
        }
      );
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
    init: function(
      element,
      valueAccessor,
      allBindings,
      viewModel,
      bindingContext
    ) {
      var value = valueAccessor();

      element.id = bindingContext.$data.sanitizedId;

      var $ul = document.createElement("ul");

      $ul.className += "mdl-menu mdl-js-menu mdl-js-ripple-effect";
      $ul.setAttribute("for", bindingContext.$data.sanitizedId);

      var updatePriority = function() {
        value(parseInt(this.getAttribute("data-value")));
      };

      for (var idx = 1; idx <= 9; idx++) {
        // add each item to the list
        var $li = document.createElement("li");

        $li.className += "mdl-menu__item";
        $li.textContent = idx;
        $li.setAttribute("data-value", idx);
        $li.onclick = updatePriority;

        $ul.appendChild($li);
      }

      element.after($ul);

      window.componentHandler.upgradeElement($ul);
      window.componentHandler.upgradeElement(element);
    }
  };

  ko.bindingHandlers.aliasModal = {
    init: function(
      element,
      valueAccessor,
      allBindings,
      viewModel,
      bindingContext
    ) {
      var dialog = document.querySelector(
        "#modal-" + bindingContext.$data.sanitizedId
      );
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
