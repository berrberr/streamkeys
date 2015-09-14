"use strict";

var $ = require("jquery"),
    ko = require("ko"),
    _ = require("lodash");

require("./lib/jquery.loadTemplate-1.4.4.min.js");
var disabledBtnClass = "btn-error-border",
    disabledSpanClass = "glyphicon-remove",
    enabledBtnClass = "btn-success",
    enabledSpanClass = "glyphicon-ok";


var OptionsViewModel = function OptionsViewModel() {
  console.log("optons view model created");
  var self = this;

  self.selectedTab = ko.observable("sites");

  self.sitelistInitialzed = ko.observable(false);
  self.sitelist = ko.observableArray([]);

  self.sitelistChanged = function() {
    console.log("sitelist changed", self.sitelistInitialzed());
    if(self.sitelistInitialzed()) {
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

    self.sitelistInitialzed(true);
  });
};

var MusicSite = (function() {
  function MusicSite(attributes) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.enabled = ko.observable(attributes.enabled);

    this.toggleSite = function() {
      console.log("toggle da site mon");
      this.enabled(!this.enabled.peek());
    };
  }

  return MusicSite;
})();

document.addEventListener("DOMContentLoaded", function() {
  ko.applyBindings(new OptionsViewModel());
});

/**
 * Renders the site enabled/disable button
 * @param id {String} id of site, used as key in settings object
 * @param name {String} full name of site, displayed in button
 * @param is_enabled {Boolean} is button enabled
 */
var renderSiteButton = function(id, name, is_enabled) {
  var template_name = is_enabled ? "#template-enabled" : "#template-disabled";
  $("#sitelist").loadTemplate(
    $(template_name),
    {
      site_id: id,
      site_name: name,
      enabled: is_enabled
    },
    {append: true}
  );
};

/**
 * Toggles the style of a site button to enabled/disabled
 * @param selector {String} CSS selector for button to toggle
 * @param is_disabled {String} String representation of boolean (from element attribute)
 */
var toggleSiteButton = function(selector, is_disabled) {
  var el = $(selector),
      span = $($(selector).children("span")[0]);
  var btnClass = (is_disabled === "false") ? [disabledBtnClass, enabledBtnClass] : [enabledBtnClass, disabledBtnClass];
  var spanClass = (is_disabled === "false") ? [disabledSpanClass, enabledSpanClass] : [enabledSpanClass, disabledSpanClass];
  el.addClass(btnClass[0]).removeClass(btnClass[1]);
  span.addClass(spanClass[0]).removeClass(spanClass[1]);
};

chrome.runtime.sendMessage({action: "get_sites"}, function(response) {
  console.log("RESP: ", response);
  $.each(response, function(key, val) {
    renderSiteButton(key, val.name, val.enabled);
  });

  // On clicking a site name checkbox
  $(".btn-site-enable").click(function(el) {
    var sites = {},
        site_id = el.currentTarget.id,
        el_id = "[id=\"" + el.currentTarget.id + "\"]";

    console.log(el.currentTarget.id);
    console.log(el_id);

    // These are strings not bools, so inverse the attr value with str compare
    var toggleVal = $(el_id).attr("is-enabled") === "true" ? "false" : "true";
    $(el_id).attr("is-enabled", toggleVal);

    // Toggle the button state
    toggleSiteButton(el_id, $(el_id).attr("is-enabled"));

    // Generate localstorage object of form {sitename => enabled}
    // Convert the string representation into boolean
    $(".btn-site-enable").each(function(index, site) {
      sites[$(site).attr("id")] = JSON.parse($(site).attr("is-enabled"));
    });

    chrome.storage.local.set({"hotkey-sites": sites}, function() {
      chrome.runtime.sendMessage({action: "update_keys", site_id: site_id});
    });
  });
});
