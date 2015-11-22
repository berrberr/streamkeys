;(function() {
  "use strict";

  // Needed for phantomjs to work
  // @see [https://github.com/ariya/phantomjs/issues/12401]
  require("es6-promise").polyfill();

  var _ = require("lodash"),
      URL = require("urlutils");

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
          return (re.test(_url) && !blacklistRe.test(parsedUrl.host));
        }
      };
    }

    return re;
  };

  /**
   * Base class for all sites enabled in extension
   */
  function Sitelist(sites) {
    this.validSiteAttributes = [
      "name", "url", "controller", "alias", "blacklist"
    ];

    this.sites = sites || {
      "7digital": { name: "7digital", url: "http://www.7digital.com" },
      "8tracks": { name: "8tracks", url: "http://www.8tracks.com" },
      "amazon": { name: "Amazon Cloud Player", url: "https://www.amazon.com/gp/dmusic/cloudplayer/player" },
      "ambientsleepingpill": { name: "Ambient Sleeping Pill", url: "http://www.ambientsleepingpill.com" },
      "asoftmurmur": { name: "A Soft Murmur", url: "http://www.asoftmurmur.com" },
      "audible": { name: "Audible", url: "http://www.audible.com" },
      "audiosplitter": { name: "Audiosplitter", url: "http://www.audiosplitter.fm" },
      "bandcamp": { name: "Bandcamp", url: "http://www.bandcamp.com" },
      "bbc": { name: "BBC Radio", url: "http://www.bbc.co.uk/radio", controller: "BBCRadioController.js" },
      "beatport": { name: "Beatport", url: "https://www.beatport.com" },
      "blitzr": { name: "Blitzr", url: "http://www.blitzr.com" },
      "cubic": { name: "Cubic.fm", url: "http://www.cubic.fm" },
      "deezer": { name: "Deezer", url: "http://www.deezer.com" },
      "demodrop": { name: "DemoDrop", url: "http://www.demodrop.com" },
      "di": { name: "Di.fm", url: "http://www.di.fm" },
      "disco": { name: "Disco.io", url: "http://www.disco.io" },
      "earbits": { name: "Earbits", url: "http://www.earbits.com" },
      "player.edge": { name: "Edge Player", url: "http://player.edge.ca", controller: "EdgeController.js" },
      "playmoss": { name: "Playmoss", url: "http://www.playmoss.com" },
      "emby": { name: "Emby", url: "http://app.emby.media" },
      "feedly": { name: "Feedly", url: "http://www.feedly.com" },
      "gaana": { name: "Gaana", url: "http://www.gaana.com" },
      "guvera": { name: "Guvera", url: "https://www.guvera.com" },
      "play.google": { name: "Google Play Music", url: "http://play.google.com", controller: "GoogleMusicController.js" },
      "hypem": { name: "Hypemachine", url: "http://www.hypem.com" },
      "hypster": { name: "Hypster", url: "http://www.hypster.com" },
      "iheart": { name: "iHeartRadio", url: "http://www.iheart.com" },
      "ivoox": { name: "ivoox", url: "http://www.ivoox.com" },
      "jango": { name: "Jango", url: "http://www.jango.com" },
      "kollekt": { name: "Kollekt.fm", url: "http://www.kollekt.fm" },
      "last": { name: "LastFm", url: "http://www.last.fm", controller: "LastfmController.js", alias: ["lastfm"] },
      "mixcloud": { name: "Mixcloud", url: "http://www.mixcloud.com" },
      "music.microsoft": { name: "Microsoft Groove", url: "http://music.microsoft.com", controller: "MicrosoftController.js" },
      "mycloudplayers": { name: "My Cloud Player", url: "http://www.mycloudplayers.com" },
      "myspace": { name: "MySpace", url: "http://www.myspace.com" },
      "netflix": { name: "Netflix", url: "http://www.netflix.com" },
      "noise": { name: "NoiseSupply", url: "http://noise.supply", controller: "NoiseSupplyController.js" },
      "noonpacific": { name: "Noon Pacific", url: "http://www.noonpacific.com" },
      "npr": { name: "NPR One Player", url: "http://one.npr.org" },
      "oplayer": { name: "oPlayer", url: "http://oplayer.org" },
      "overcast": { name: "Overcast.fm", url: "http://overcast.fm" },
      "palcomp3": { name: "Palco MP3", url: "http://palcomp3.com" },
      "pandora": { name: "Pandora", url: "http://www.pandora.com" },
      "player": { name: "Player.fm", url: "http://player.fm" },
      "pleer": { name: "Pleer", url: "http://pleer.com" },
      "plex": { name: "Plex", url: "http://www.plex.tv" },
      "pocketcasts": { name: "Pocketcasts", url: "https://play.pocketcasts.com" },
      "radioparadise": { name: "RadioParadise", url: "http://www.radioparadise.com" },
      "radioswissjazz": { name: "RadioSwissJazz", url: "http://www.radioswissjazz.ch" },
      "radiotunes": { name: "RadioTunes", url: "http://www.radiotunes.com" },
      "rainwave": { name: "Rainwave.cc", url: "http://www.rainwave.cc" },
      "rdio": { name: "Rdio", url: "http://www.rdio.com" },
      "reddit.music.player.il": { name: "Reddit Music Player", url: "http://reddit.music.player.il.ly", controller: "RedditMusicPlayerController.js", alias: ["reddit.musicplayer"] },
      "reverbnation": { name: "Reverb Nation", url: "http://www.reverbnation.com" },
      "rhapsody": { name: "Rhapsody", url: "http://www.rhapsody.com" },
      "saavn": { name: "Saavn", url: "http://www.saavn.com" },
      "seesu": { name: "Seesu.me", url: "http://www.seesu.me" },
      "shortorange": { name: "ShortOrange", url: "http://www.shortorange.com" },
      "shuffler": { name: "Shuffler.fm", url: "http://www.shuffler.fm" },
      "slacker": { name: "Slacker", url: "http://www.slacker.com" },
      "songstr": { name: "Songstr", url: "http://www.songstr.com" },
      "songza": { name: "Songza", url: "http://www.songza.com" },
      "music.sonyentertainmentnetwork": { name: "Sony Music Unlimited", url: "https://music.sonyentertainmentnetwork.com", controller: "SonyMusicUnlimitedController.js" },
      "sound": { name: "Sound.is", url: "http://www.sound.is" },
      "soundcloud": { name: "Soundcloud", url: "http://www.soundcloud.com" },
      "soundsgood": { name: "Soundsgood.co", url: "http://www.soundsgood.co" },
      "spotify": { name: "Spotify Web Player", url: "http://www.spotify.com" },
      "spreaker": { name: "Spreaker", url: "http://www.spreaker.com" },
      "stitcher": { name: "Stitcher", url: "http://www.stitcher.com" },
      "tidal": { name: "Tidal", url: "https://www.tidal.com", alias: ["tidalhifi"] },
      "thedrop": { name: "TheDrop", url: "https://www.thedrop.club" },
      "thesixtyone": { name: "TheSixtyOne", url: "http://www.thesixtyone.com" },
      "tunein": { name: "TuneIn", url: "http://www.tunein.com" },
      "twitch": { name: "Twitch.tv", url: "http://www.twitch.tv" },
      "vk": { name: "Vkontakte", url: "http://www.vk.com" },
      "music.yandex": { name: "Yandex", url: "http://music.yandex.ru", controller: "YandexController.js" },
      "radio.yandex": { name: "Yandex Radio", url: "http://radio.yandex.ru", controller: "YandexRadioController.js" },
      "youarelistening": { name: "YouAreListening.to", url: "http://www.youarelistening.to", controller: "YouarelisteningtoController.js" },
      "xiami": { name: "Xiami", url: "http://www.xiami.com" },
      "youtube": { name: "YouTube", url: "http://www.youtube.com" },
      "zonga": { name: "Zonga", url: "http://asculta.zonga.ro", controller: "ZongaController.js" }
    };

    this.disabledTabs = [];
  }


  /**
   * Get site enabled settings from localstorage
   */
  Sitelist.prototype.loadSettings = function() {
    var that = this;

    chrome.storage.local.get(function(obj) {
      var objSet = obj.hasOwnProperty("hotkey-sites"),
          storageObj = {};
      _.each(_.keys(that.sites), function(key) {
        that.addSite(
          key,
          that.sites[key],
          (objSet && (typeof obj["hotkey-sites"][key] !== "undefined")) ? obj["hotkey-sites"][key] : true
        );
        storageObj[key] = that.sites[key].enabled;
      });
      // Set the storage key on init incase previous storage format becomes broken
      chrome.storage.local.set({ "hotkey-sites": storageObj });

      // Initialize popup open on update setting
      if(!obj.hasOwnProperty("hotkey-open_on_update")) {
        chrome.storage.local.set({ "hotkey-open_on_update": true });
      }
      if(!obj.hasOwnProperty("hotkey-youtube_restart")) {
        chrome.storage.local.set({ "hotkey-youtube_restart": false });
      }
    });
  };

  /**
   * Adds a new site to `sites` and generates the URL regex
   */
  Sitelist.prototype.addSite = function(name, attributes, enabled) {
    this.sites[name] = _.extend(
      _.pick(attributes, this.validSiteAttributes),
      {
        enabled: enabled,
        url_regex: new URL_check(name, { alias: attributes.alias, blacklist: attributes.blacklist })
      }
    );
  };


  /**
   * Set site enabled settings in localstorage
   * @param {String} key - name of the hotkey-sites key in localstorage
   * @param {Object} value - value to set
   * @return {Promise}
   */
  Sitelist.prototype.setSiteStorage = function(key, value) {
    var promise = new Promise(function(resolve, reject) {
      chrome.storage.local.get(function(obj) {
        if(obj["hotkey-sites"]) {
          obj["hotkey-sites"][key] = value;
          chrome.storage.local.set({ "hotkey-sites": obj["hotkey-sites"] }, function() {
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
   * Set the disabled value of a music site and store results in localstorage
   * @param {String} url - url of site to mark as disabled
   * @param {Boolean} enabled - enable site if true, disable site if false
   */
  Sitelist.prototype.markSiteEnabledState = function(url, enabled, callback) {
    var siteName = this.getSitelistName(url),
        value = enabled;

    if(siteName) {
      this.sites[siteName].enabled = value;
      this.setSiteStorage(siteName, value).then(function() {
        callback();
      });
    } else {
      callback();
    }
  };

  /**
   * @return {Array} array of enabled site keys
   */
  Sitelist.prototype.getEnabled = function() {
    return _.keys(
      _.pick(this.sites, function(site) {
        return site.enabled;
      })
    );
  };

  /**
   * Returns the sitelist key of a url if it is matched to a music site
   * @param {String} url - url to check
   * @return {String} sitelist key if found, null otherwise
   */
  Sitelist.prototype.getSitelistName = function(url) {
    var filtered_sites = _.filter(_.keys(this.sites), function (name) {
      return this.sites[name].url_regex.test(url);
    }, this);

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
    var sites_regex = _.map(this.sites, function(site) { return site.url_regex; });

    return sites_regex.some(function(url_regex) {
      return (url_regex.test(url));
    });
  };

  /**
   * @param {Number} tabId - id of tab to temp disable
   * @param {Boolean} enabled - enable tab if true, disable tab if false
   */
  Sitelist.prototype.markTabEnabledState = function(tabId, enabled) {
    tabId = parseInt(tabId);
    if(enabled) {
      this.disabledTabs = this.disabledTabs.filter(function(tab) { return tab !== tabId; });
    } else {
      if(this.disabledTabs.indexOf(tabId) == -1) this.disabledTabs.push(parseInt(tabId));
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
      var site = this.sites[site_name];
      if(site.controller) return site.controller;

      return (site_name[0].toUpperCase() + site_name.slice(1) + "Controller.js");
    }

    return null;
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

  module.exports = Sitelist;
})();
