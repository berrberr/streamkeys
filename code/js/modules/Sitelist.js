;(function() {
  "use strict";

  var $ = require("jquery");

  /**
   * @return {RegExp} a regex that matches where the string is in a url's (domain) name
   */
  var URL_check = function(domain, opts) {
    opts = opts || {};
    var inner = opts.alias ? domain + "|www." + domain + "|" + opts.alias.join("|") : domain + "|www." + domain;

    // The {0, 3} matching group is there to match up to 3 subdomains
    var re = new RegExp("^(http|https):\/\/(?:[^.]*\\.){0,3}(?:" + inner + ")\\.+");
    if(opts.blacklist) {
      var blacklistRe = new RegExp("(" + opts.blacklist.join("|") + ")");

      // XXX: All URL checks (should) make a call to `.test` on the RegExp
      // Here we override it with a custom function to account for blacklisted hostnames
      return {
        test: function(_url) {
          var parsedUrl = new URL(_url);
          return (re.test(_url) && blacklistRe.test(parsedUrl.host));
        }
      };
    }

    return re;
  };

  /**
   * Base class for all sites enabled in extension
   */
  var Sitelist = function() { return this; };

  Sitelist.prototype.init = function() {
    this.sites = {
      "7digital": {name: "7digital", url: "http://www.7digital.com", enabled: true},
      "8tracks": {name: "8tracks", url: "http://www.8tracks.com", enabled: true},
      "amazon": {name: "Amazon Cloud Player", url: "https://www.amazon.com/gp/dmusic/cloudplayer/player", enabled: true},
      "ambientsleepingpill": {name: "Ambient Sleeping Pill", url: "http://www.ambientsleepingpill.com", enabled: true},
      "asoftmurmur": {name: "A Soft Murmur", url: "http://www.asoftmurmur.com", enabled: true},
      "audiosplitter": {name: "Audiosplitter", url: "http://www.audiosplitter.fm", enabled: true},
      "bandcamp": {name: "Bandcamp", url: "http://www.bandcamp.com", enabled: true},
      "bbc": {name: "BBC Radio", url: "http://www.bbc.co.uk/radio", controller: "BBCRadioController.js", enabled: true},
      "beatsmusic": {name: "Beats Web Player", url: "https://listen.beatsmusic.com", enabled: true},
      "beta.last": {name: "LastFm", url: "http://beta.last.fm", controller: "BetaLastfmController.js", enabled: true},
      "blitzr": {name: "Blitzr", url: "http://www.blitzr.com", enabled: true},
      "bop": {name: "Bop.fm", url: "http://www.bop.fm", enabled: true},
      "cubic": {name: "Cubic.fm", url: "http://www.cubic.fm", enabled: true},
      "deezer": {name: "Deezer", url: "http://www.deezer.com", enabled: true},
      "di": {name: "Di.fm", url: "http://www.di.fm", enabled: true},
      "disco": {name: "Disco.io", url: "http://www.disco.io", enabled: true},
      "earbits": {name: "Earbits", url: "http://www.earbits.com", enabled: true},
      "player.edge": {name: "Edge Player", url: "http://player.edge.ca", controller: "EdgeController.js", enabled: true},
      "emby": {name: "Emby", url: "http://app.emby.media", enabled: true},
      "gaana": {name: "Gaana", url: "http://www.gaana.com", enabled: true},
      "guvera": {name: "Guvera", url: "https://www.guvera.com", enabled: true},
      "play.google": {name: "Google Play Music", url: "http://play.google.com", controller: "GoogleMusicController.js", enabled: true},
      "grooveshark": {name: "Grooveshark", url: "http://www.grooveshark.com", enabled: true},
      "hypem": {name: "Hypemachine", url: "http://www.hypem.com", enabled: true},
      "hypster": {name: "Hypster", url: "http://www.hypster.com", enabled: true},
      "iheart": {name: "iHeartRadio", url: "http://www.iheart.com", enabled: true},
      "ivoox": {name: "ivoox", url: "http://www.ivoox.com", enabled: true},
      "jango": {name: "Jango", url: "http://www.jango.com", enabled: true},
      "kollekt": {name: "Kollekt.fm", url: "http://www.kollekt.fm", enabled: true},
      "laracasts": {name: "Laracasts", url: "http://www.laracasts.com", enabled: true},
      "last": {name: "LastFm", url: "http://www.last.fm", controller: "LastfmController.js", enabled: true, alias: ["lastfm"], blacklist: ["beta.last.fm"]},
      "mixcloud": {name: "Mixcloud", url: "http://www.mixcloud.com", enabled: true},
      "mycloudplayers": {name: "My Cloud Player", url: "http://www.mycloudplayers.com", enabled: true},
      "myspace": {name: "MySpace", url: "http://www.myspace.com", enabled: true},
      "netflix": {name: "Netflix", url: "http://www.netflix.com", enabled: true},
      "noise": {name: "NoiseSupply", url: "http://noise.supply", controller: "NoiseSupplyController.js", enabled: true},
      "npr": {name: "NPR One Player", url: "http://one.npr.org", enabled: true},
      "oplayer": {name: "oPlayer", url: "http://oplayer.org", enabled: true},
      "palcomp3": {name: "Palco MP3", url: "http://palcomp3.com", enabled: true},
      "pandora": {name: "Pandora", url: "http://www.pandora.com", enabled: true},
      "player.fm": {name: "Player.fm", url: "http://player.fm", controller: "PlayerController.js", enabled: true},
      "pleer": {name: "Pleer", url: "http://pleer.com", enabled: true},
      "plex": {name: "Plex", url: "http://www.plex.tv", enabled: true},
      "pocketcasts": {name: "Pocketcasts", url: "https://play.pocketcasts.com", enabled: true},
      "radioparadise": {name: "RadioParadise", url: "http://www.radioparadise.com", enabled: true},
      "radioswissjazz": {name: "RadioSwissJazz", url: "http://www.radioswissjazz.ch", enabled: true},
      "rainwave": {name: "Rainwave.cc", url: "http://www.rainwave.cc", enabled: true},
      "rdio": {name: "Rdio", url: "http://www.rdio.com", enabled: true},
      "reddit.music.player.il": {name: "Reddit Music Player", url: "http://reddit.music.player.il.ly", controller: "RedditMusicPlayerController.js", enabled: true, alias: ["reddit.musicplayer"]},
      "reverbnation": {name: "Reverb Nation", url: "http://www.reverbnation.com", enabled: true},
      "saavn": {name: "Saavn", url: "http://www.saavn.com", enabled: true},
      "seesu": {name: "Seesu.me", url: "http://www.seesu.me", enabled: true},
      "shortorange": {name: "ShortOrange", url: "http://www.shortorange.com", enabled: true},
      "shuffler": {name: "Shuffler.fm", url: "http://www.shuffler.fm", enabled: true},
      "slacker": {name: "Slacker", url: "http://www.slacker.com", enabled: true},
      "songstr": {name: "Songstr", url: "http://www.songstr.com", enabled: true},
      "songza": {name: "Songza", url: "http://www.songza.com", enabled: true},
      "music.sonyentertainmentnetwork": {name: "Sony Music Unlimited", url: "https://music.sonyentertainmentnetwork.com", controller: "SonyMusicUnlimitedController.js", enabled: true},
      "sound": {name: "Sound.is", url: "http://www.sound.is", enabled: true},
      "soundcloud": {name: "Soundcloud", url: "http://www.soundcloud.com", enabled: true},
      "soundsgood": {name: "Soundsgood.co", url: "http://www.soundsgood.co", enabled: true},
      "spotify": {name: "Spotify Web Player", url: "http://www.spotify.com", enabled: true},
      "spreaker": {name: "Spreaker", url: "http://www.spreaker.com", enabled: true},
      "stitcher": {name: "Stitcher", url: "http://www.stitcher.com", enabled: true},
      "tidal": {name: "Tidal", url: "https://www.tidal.com", enabled: true, alias: ["tidalhifi"]},
      "thedrop": {name: "TheDrop", url: "https://www.thedrop.club", enabled: true},
      "thesixtyone": {name: "TheSixtyOne", url: "http://www.thesixtyone.com", enabled: true},
      "tunein": {name: "TuneIn", url: "http://www.tunein.com", enabled: true},
      "twitch": {name: "Twitch.tv", url: "http://www.twitch.tv", enabled: true},
      "vk": {name: "Vkontakte", url: "http://www.vk.com", enabled: true},
      "xbox": {name: "Xbox Music", url: "http://music.xbox.com", enabled: true},
      "music.yandex": {name: "Yandex", url: "http://music.yandex.ru", controller: "YandexController.js", enabled: true},
      "radio.yandex": {name: "Yandex Radio", url: "http://radio.yandex.ru", controller: "YandexRadioController.js", enabled: true},
      "youarelistening": {name: "YouAreListening.to", url: "http://www.youarelistening.to", controller: "YouarelisteningtoController.js", enabled: true},
      "youtube": {name: "YouTube", url: "http://www.youtube.com", enabled: true},
      "zonga": {name: "Zonga", url: "http://asculta.zonga.ro", controller: "ZongaController.js", enabled: true}
    };
    this.disabledTabs = [];
  };

  /**
   * Get site enabled settings from localstorage
   */
  Sitelist.prototype.loadSettings = function() {
    var that = this;
    if(!this.sites) this.init();
    console.log(this);
    chrome.storage.local.get(function(obj) {
      var objSet = obj.hasOwnProperty("hotkey-sites"),
          storageObj = {};
      $.each(that.sites, function(key) {
        if(objSet && (typeof obj["hotkey-sites"][key] !== "undefined")) that.sites[key].enabled = obj["hotkey-sites"][key];
        that.sites[key].url_regex = new URL_check(key, { alias: that.sites[key].alias, blacklist: that.sites[key].blacklist });
        storageObj[key] = that.sites[key].enabled;
      });
      // Set the storage key on init incase previous storage format becomes broken
      chrome.storage.local.set({"hotkey-sites": storageObj});
    });
  };

  /**
   * Set site enabled settings in localstorage
   * @param {String} key - name of the hotkey-sites key in localstorage
   * @param {Object} value - value to set
   * @return {Promise}
   */
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

  /**
   * @return {Array} array of enabled sites
   */
  Sitelist.prototype.getEnabled = function() {
    return $.map(this.sites, function(val, key) {
      if(val.enabled) return key;
    });
  };

  /**
   * Returns the sitelist key of a url if it is matched to a music site
   * @param {String} url - url to check
   * @return {String} sitelist key if found, null otherwise
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
   * @return {Promise}
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
   * @param url {String} url of site to check for
   * @return {Boolean} true if url matches an enabled site
   */
  Sitelist.prototype.checkEnabled = function(url) {
    var _sites = this.sites;

    return this.getEnabled().some(function(sitename) {
      return (_sites[sitename].url_regex.test(url));
    });
  };

  /**
   * Checks if a tab has been temp disabled
   * @param {Number} tabId - id of tab to check
   * @return {Boolean} true if tab is enabled
   */
  Sitelist.prototype.checkTabEnabled = function(tabId) {
    return (tabId && this.disabledTabs.indexOf(tabId) === -1);
  };

  /**
   * @param {String} url - url of site to check for
   * @return {Boolean} true if url matches a music site
   */
  Sitelist.prototype.checkMusicSite = function(url) {
    var sites_regex = $.map(this.sites, function(el) { return el.url_regex; });

    return sites_regex.some(function(url_regex) {
      return (url_regex.test(url));
    });
  };

  /**
   * Set the disabled value of a music site and store results in localstorage
   * @param {String} url - url of site to mark as disabled
   * @param {Boolean} is_disabled - disable site if true, enable site if false
   */
  Sitelist.prototype.markSiteAsDisabled = function(url, is_disabled) {
    var site_name = this.getSitelistName(url),
        value = !is_disabled;
    if(site_name) {
      this.sites[site_name].enabled = value;
      this.setStorage(site_name, value);
    }
  };

  /**
   * @param {Number} tabId - id of tab to temp disable
   * @param {Boolean} is_disabled - disable tab if true, enable tab if false
   */
  Sitelist.prototype.markTabAsDisabled = function(tabId, is_disabled) {
    tabId = parseInt(tabId);
    if(is_disabled) {
      this.disabledTabs.push(parseInt(tabId));
    }
    else {
      this.disabledTabs = this.disabledTabs.filter(function(tab) { return tab !== tabId; });
    }
  };

  /**
   * Gets the filename of a sites controller
   * @param {String} url - URL to get controller for
   * @return {String} controller filename if found
   */
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
   * Gets an array of all active and enabled music tabs
   * @return {Promise}
   */
  Sitelist.prototype.getActiveMusicTabs = function() {
    var that = this;
    var promise = new Promise(function(resolve) {
      var music_tabs = [];
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          if(that.checkEnabled(tab.url) && that.checkTabEnabled(tab.id)) music_tabs.push(tab);
        });

        resolve(music_tabs);
      });
    });

    return promise;
  };

  /**
   * Gets an array of all tabs that are music tabs, ignoring whether they are active
   * @return {Promise}
   */
  Sitelist.prototype.getMusicTabs = function() {
    var that = this;
    var promise = new Promise(function(resolve) {
      var music_tabs = [];
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          if(that.checkEnabled(tab.url)) {
            tab.streamkeysEnabled = that.checkTabEnabled(tab.id);
            music_tabs.push(tab);
          }
        });

        resolve(music_tabs);
      });
    });

    return promise;
  };

  /**
   * When Sitelist is required create a new singleton and return that
   * Note: This makes all methods/properties of Sitelist publicly exposed
   */
  module.exports = new Sitelist();
})();
