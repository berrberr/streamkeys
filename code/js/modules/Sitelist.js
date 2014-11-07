;(function() {
  "use strict";

  var $ = require("jquery");

  /**
   * @return [RegExp] a regex that matches where the string is in a url's (domain) name
   */
  var URL_check = function(domain) {
    return (new RegExp("^(http|https)*(:\/\/)*(.*\\.)*(" + domain + "|www." + domain +")+\\."));
  };

  /**
   * Base class for all sites enabled in extension
   */
  var Sitelist = function() { return this; };

  Sitelist.prototype.init = function() {
    this.sites = {
      "7digital": {name: "7digital", url: "http://www.7digital.com", enabled: true, url_regex: null},
      "8tracks": {name: "8tracks", url: "http://www.8tracks.com", enabled: true, url_regex: null},
      "amazon": {name: "Amazon Cloud Player", url: "https://www.amazon.com/gp/dmusic/cloudplayer/player",
          enabled: true, url_regex: null},
      "ambientsleepingpill": {name: "Ambient Sleeping Pill", url: "http://www.ambientsleepingpill.com",
          enabled: true, url_regex: null},
      "bandcamp": {name: "Bandcamp", url: "http://www.bandcamp.com", enabled: true, url_regex: null},
      "bop": {name: "Bop.fm", url: "http://www.bop.fm", enabled: true, url_regex: null},
      "cubic": {name: "Cubic.fm", url: "http://www.cubic.fm", enabled: true, url_regex: null},
      "deezer": {name: "Deezer", url: "http://www.deezer.com", enabled: true, url_regex: null},
      "di": {name: "Di.fm", url: "http://www.di.fm", enabled: true, url_regex: null},
      "earbits": {name: "Earbits", url: "http://www.earbits.com", enabled: true, url_regex: null},
      "player.edge": {name: "Edge Player", url: "http://player.edge.ca", controller: "EdgeController.js",
          enabled: true, url_regex: null},
      "grooveshark": {name: "Grooveshark", url: "http://www.grooveshark.com", enabled: true, url_regex: null},
      "hypem": {name: "Hypemachine", url: "http://www.hypem.com", enabled: true, url_regex: null},
      "iheart": {name: "iHeartRadio", url: "http://www.iheart.com", enabled: true, url_regex: null},
      "jango": {name: "Jango", url: "http://www.jango.com", enabled: true, url_regex: null},
      "last": {name: "LastFm", url: "http://www.last.fm", controller: "LastfmController.js", enabled: true, url_regex: null},
      "mixcloud": {name: "Mixcloud", url: "http://www.mixcloud.com", enabled: true, url_regex: null},
      "music.sonyentertainmentnetwork": {name: "SonyMusicUnlimited", url: "https://music.sonyentertainmentnetwork.com",
          controller: "SonyMusicUnlimitedController.js", enabled: true, url_regex: null},
      "myspace": {name: "MySpace", url: "http://www.myspace.com", enabled: true, url_regex: null},
      "npr": {name: "NPR One Player", url: "http://one.npr.org", enabled: true, url_regex: null},
      "oplayer": {name: "oPlayer", url: "http://oplayer.org", enabled: true, url_regex: null},
      "pandora": {name: "Pandora", url: "http://www.pandora.com", enabled: true, url_regex: null},
      "pleer": {name: "Pleer.com", url: "http://pleer.com", enabled: true, url_regex: null},
      "plex": {name: "Plex", url: "http://www.plex.tv", enabled: true, url_regex: null},
      "pocketcasts": {name: "Pocketcasts", url: "https://play.pocketcasts.com", enabled: true, url_regex: null},
      "play.google": {name: "Google Music", url: "http://play.google.com", controller: "GoogleMusicController.js",
          enabled: true, url_regex: null},
      "rainwave": {name: "Rainwave.cc", url: "http://www.rainwave.cc", enabled: true, url_regex: null},
      "radioparadise": {name: "RadioParadise", url: "http://www.radioparadise.com", enabled: true, url_regex: null},
      "rdio": {name: "Rdio", url: "http://www.rdio.com", enabled: true, url_regex: null},
      "seesu": {name: "Seesu.me", url: "http://www.seesu.me", enabled: true, url_regex: null},
      "slacker": {name: "Slacker", url: "http://www.slacker.com", enabled: true, url_regex: null},
      "songstr": {name: "Songstr", url: "http://www.songstr.com", enabled: true, url_regex: null},
      "songza": {name: "Songza", url: "http://www.songza.com", enabled: true, url_regex: null},
      "soundcloud": {name: "Soundcloud", url: "http://www.soundcloud.com", enabled: true, url_regex: null},
      "spotify": {name: "Spotify Web Player", url: "http://www.spotify.com", enabled: true, url_regex: null},
      "stitcher": {name: "Stitcher", url: "http://www.stitcher.com", enabled: true, url_regex: null},
      "tunein": {name: "TuneIn", url: "http://www.tunein.com", enabled: true, url_regex: null},
      "thesixtyone": {name: "TheSixtyOne", url: "http://www.thesixtyone.com", enabled: true, url_regex: null},
      "vk": {name: "Vkontakte", url: "http://www.vk.com", enabled: true, url_regex: null},
      "yandex": {name: "Yandex", url: "http://music.yandex.ru", enabled: true, url_regex: null},
      "youarelistening": {name: "YouAreListening.to", url: "http://www.youarelistening.to",
          controller: "YouarelisteningtoController.js", enabled: true, url_regex: null},
      "youtube": {name: "YouTube", url: "http://www.youtube.com", enabled: true, url_regex: null}
    };
    this.disabledTabs = [];
  };

  // Get site enabled settings from localstorage
  Sitelist.prototype.loadSettings = function() {
    var that = this;
    if(!this.sites) this.init();
    console.log(this);
    chrome.storage.local.get(function(obj) {
      var objSet = obj.hasOwnProperty("hotkey-sites"),
          storageObj = {};
      $.each(that.sites, function(key) {
        if(objSet && (typeof obj["hotkey-sites"][key] !== "undefined")) that.sites[key].enabled = obj["hotkey-sites"][key];
        that.sites[key].url_regex = new URL_check(key);
        storageObj[key] = that.sites[key].enabled;
      });
      // Set the storage key on init incase previous storage format becomes broken
      chrome.storage.local.set({"hotkey-sites": storageObj});
    });
  };

  // Set site enabled settings in localstorage
  Sitelist.prototype.setStorage = function(key, value) {
    var promise = new Promise(function(resolve, reject) {
      chrome.storage.local.get(function(obj) {
        if(obj["hotkey-sites"]) {
          obj["hotkey-sites"][key] = value;
          chrome.storage.local.set({"hotkey-sites": obj["hotkey-sites"]}, function() {
            resolve(true);
          });
        } else {
          reject("Storage object not found.");
        }
      });
    });

    return promise;
  };

  // @return [arr] enabled sites
  Sitelist.prototype.getEnabled = function() {
    return $.map(this.sites, function(val, key) {
      if(val.enabled) return key;
    });
  };

  /**
   * Returns the sitelist key of a url if it is matched to a music site
   * @param url [str] url to check
   * @return [str] sitelist key if found, null otherwise
   */
  Sitelist.prototype.getSitelistName = function(url) {
    var filtered_sites = $.grep(Object.keys(window.sk_sites.sites), function (name) {
      return window.sk_sites.sites[name].url_regex.test(url);
    });

    if (!filtered_sites.length) return null;

    return filtered_sites[0];
  };

  /**
   * Gets all of the tabId's of a music site
   */
  Sitelist.prototype.getMusicTabsByUrl = function(url) {
    var sitelist_name = this.getSitelistName(url),
        that = this;

    var promise = new Promise(function(resolve, reject) {
      if(sitelist_name === null) reject([]);

      var tab_ids = [];
      var url_regex = that.sites[sitelist_name].url_regex;
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
          if(url_regex.test(tab.url)) tab_ids.push(tab.id);
        }, this);
        resolve(tab_ids);
      });
    });

    return promise;
  };

  /**
   * @param url [str] url of site to check for
   * @return [bool] true if url matches an enabled site
   */
  Sitelist.prototype.checkEnabled = function(url) {
    var _sites = this.sites;

    return this.getEnabled().some(function(sitename) {
      return (_sites[sitename].url_regex.test(url));
    });
  };

  /**
   * @param url [str] url of site to check for
   * @return [bool] true if url matches a music site
   */
  Sitelist.prototype.checkMusicSite = function(url) {
    var sites_regex = $.map(this.sites, function(el) { return el.url_regex; });

    return sites_regex.some(function(url_regex) {
      return (url_regex.test(url));
    });
  };

  Sitelist.prototype.setSiteTabIcons = function(url) {
    this.getMusicTabsByUrl(url).then(function(tab_ids) {
      tab_ids.forEach(function(tab_id) {
        chrome.runtime.sendMessage({action: "set_icon", url: url, tab_id: tab_id});
      });
    }, function(err) {
      console.log(err);
    });
  };

  /**
   * Set the disabled value of a music site and store results in localstorage
   * @param url [str] url of site to mark as disabled
   * @param is_disabled [bool] disable site if true, enable site if false
   */
  Sitelist.prototype.markSiteAsDisabled = function(url, is_disabled) {
    var site_name = this.getSitelistName(url),
        value = !is_disabled;
    if(site_name) {
      this.sites[site_name].enabled = value;
      this.setStorage(site_name, value).then(function() {
        this.setSiteTabIcons(url);
      }, function(err) {
        console.log(err);
      });
    }
  };

  /**
   * Checks if a tab has been temp disabled
   * @param tabId [int] id of tab to check
   * @return [bool] true if tab is enabled
   */
  Sitelist.prototype.checkTabEnabled = function(tabId) {
    return (tabId && this.disabledTabs.indexOf(tabId) === -1);
  };

  /**
   * @param tabId [int] id of tab to temp disable
   * @param is_disabled [bool] disable tab if true, enable tab if false
   */
  Sitelist.prototype.markTabAsDisabled = function(tabId, is_disabled) {
    if(is_disabled)
      this.disabledTabs.push(tabId);
    else
      this.disabledTabs = this.disabledTabs.filter(function(el) { return el !== tabId; });
  };

  Sitelist.prototype.getController = function(url) {
    var site_name = this.getSitelistName(url);
    if(site_name) {
      var site = window.sk_sites.sites[site_name];
      if(site.controller) return site.controller;

      return (site_name[0].toUpperCase() + site_name.slice(1) + "Controller.js");
    }

    return null;
  };

  /**
   * When Sitelist is required create a new singleton and return that
   * Note: This makes all methods/properties of Sitelist publicly exposed
   */
  var singleton = new Sitelist();
  module.exports = singleton;
})();
