;(function() {
  "use strict";

  /**
   * Needed for phantomjs to work
   * @see [https://github.com/ariya/phantomjs/issues/12401]
   */
  require("es6-promise").polyfill();

  var _ = require("lodash"),
      URL = require("urlutils");

  // The _internal_ version of the objects in localstorage
  var STORAGE_VERSION = 1;

  /**
   * @return {RegExp} a regex that matches where the string is in a url's (domain) name
   */
  var URLCheck = function(domain, opts) {
    opts = opts || {};

    var inner =
      opts.alias
        ? domain + "|www." + domain + "|" +  _.map(opts.alias,  _.escapeRegExp).join("|")
        : domain + "|www." + domain;

    // [A-Za-z0-9-] should capture all valid characters in a (sub)domain
    // The {0, 3} matching group is there to match up to 3 subdomains
    var re = new RegExp("^(http|https):\/\/(?:[A-Za-z0-9-]*\\.){0,3}(?:" + inner + ")(\\.|:|$)+");

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
      "22tracks": { name: "22tracks", url: "http://www.22tracks.com" },
      "7digital": { name: "7digital", url: "http://www.7digital.com" },
      "8tracks": { name: "8tracks", url: "http://www.8tracks.com" },
      "amazon": { name: "Amazon Cloud Player", url: "https://www.amazon.com/gp/dmusic/cloudplayer/player" },
      "accuradio": { name: "Accuradio", url: "https://www.accuradio.com" },
      "ambientsleepingpill": { name: "Ambient Sleeping Pill", url: "http://www.ambientsleepingpill.com" },
      "anghami": { name: "Anghami", url: "https://www.anghami.com" },
      "asoftmurmur": { name: "A Soft Murmur", url: "http://www.asoftmurmur.com" },
      "audible": { name: "Audible", url: "http://www.audible.com" },
      "audiosplitter": { name: "Audiosplitter", url: "http://www.audiosplitter.fm" },
      "bandcamp": { name: "Bandcamp", url: "http://www.bandcamp.com" },
      "bbc": { name: "BBC Radio", url: "http://www.bbc.co.uk/radio", controller: "BBCRadioController.js" },
      "beatport": { name: "Beatport", url: "https://www.beatport.com" },
      "blitzr": { name: "Blitzr", url: "http://www.blitzr.com" },
      "coursera": { name: "Coursera", url: "http://www.coursera.org" },
      "cubic": { name: "Cubic.fm", url: "http://www.cubic.fm" },
      "deezer": { name: "Deezer", url: "http://www.deezer.com" },
      "demodrop": { name: "DemoDrop", url: "http://www.demodrop.com" },
      "di": { name: "Di.fm", url: "http://www.di.fm" },
      "disco": { name: "Disco.io", url: "http://www.disco.io" },
      "disi": { name: "Disi", url: "http://www.disi.co.il/" },
      "earbits": { name: "Earbits", url: "http://www.earbits.com" },
      "egghead": { name: "egghead.io", url: "https://egghead.io" },
      "emby": { name: "Emby", url: "http://app.emby.media" },
      "feedly": { name: "Feedly", url: "http://www.feedly.com" },
      "gaana": { name: "Gaana", url: "http://www.gaana.com" },
      "grooveshark": { name: "Grooveshark", url: "http://groovesharks.org", alias:["groovesharks"] },
      "giantbomb": { name: "Giantbomb", url: "http://giantbomb.com" },
      "guvera": { name: "Guvera", url: "https://www.guvera.com" },
      "play.google": { name: "Google Play Music", url: "http://play.google.com", controller: "GoogleMusicController.js" },
      "player.edge": { name: "Edge Player", url: "http://player.edge.ca", controller: "EdgeController.js" },
      "playmoss": { name: "Playmoss", url: "http://www.playmoss.com" },
      "hypem": { name: "Hypemachine", url: "http://www.hypem.com" },
      "hypster": { name: "Hypster", url: "http://www.hypster.com" },
      "iheart": { name: "iHeartRadio", url: "http://www.iheart.com" },
      "ivoox": { name: "ivoox", url: "http://www.ivoox.com" },
      "jamendo": { name: "Jamendo", url: "https://www.jamendo.com" },
      "jango": { name: "Jango", url: "http://www.jango.com" },
      "kollekt": { name: "Kollekt.fm", url: "http://www.kollekt.fm" },
      "last": { name: "LastFm", url: "http://www.last.fm", controller: "LastfmController.js", alias: ["lastfm"] },
      "listenonrepeat": { name: "ListenOnRepeat", url: "http://www.listenonrepeat.com" },
      "livephish": { name: "LivePhish", url: "http://plus.livephish.com" },
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
      "player": { name: "Player.fm", url: "http://player.fm", controller: "PlayerFmController.js", blacklist: ["player.spotify", "reddit.music.player.il", "reddit.musicplayer.io"] },
      "pleer": { name: "Pleer", url: "http://pleer.com" },
      "plex": { name: "Plex", url: "http://www.plex.tv" },
      "pluralsight": { name: "Pluralsight", url: "https://app.pluralsight.com" },
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
      "youzeek": { name: "YOUZEEK", url: "http://www.youzeek.com" },
      "zonga": { name: "Zonga", url: "http://asculta.zonga.ro", controller: "ZongaController.js" }
    };

    this.disabledTabs = [];
  }


  /**
   * Get site enabled settings from localstorage
   */
  Sitelist.prototype.loadSettings = function() {
    var that = this;

    chrome.storage.sync.get(function(obj) {
      var objSet = _.has(obj, "hotkey-sites"),
          storageObj = {};

      // Migrate old storage versions to new format
      var version = (typeof obj["hotkey-storage-version"] === "undefined") ? 0 : obj["hotkey-storage-version"];

      _.each(_.keys(that.sites), function(siteKey) {
        var siteObj =
          (version === 0)
            ? {
                enabled: objSet ? obj["hotkey-sites"][siteKey] || false : true,
                priority: 1,
                alias: []
              }
            : (objSet && obj["hotkey-sites"][siteKey])
              // Validate enabled/priority values in case of migration problems
              ? {
                  enabled: _.isBoolean(obj["hotkey-sites"][siteKey].enabled) ? obj["hotkey-sites"][siteKey].enabled : true,
                  priority: _.isNumber(obj["hotkey-sites"][siteKey].priority) ? obj["hotkey-sites"][siteKey].priority : 1,
                  alias: _.isArray(obj["hotkey-sites"][siteKey].alias) ? obj["hotkey-sites"][siteKey].alias : []
                }
              : { enabled: true, priority: 1, alias: [] };

        that.addSite(
          siteKey,
          siteObj
        );

        storageObj[siteKey] = siteObj;
      });

      // Set the storage key on init incase previous storage format becomes broken
      chrome.storage.sync.set({ "hotkey-sites": storageObj });

      // Set storage version
      chrome.storage.sync.set({ "hotkey-storage-version": STORAGE_VERSION });

      // Initialize popup open on update setting
      if(!obj.hasOwnProperty("hotkey-open_on_update")) {
        chrome.storage.sync.set({ "hotkey-open_on_update": true });
      }
      if(!obj.hasOwnProperty("hotkey-youtube_restart")) {
        chrome.storage.sync.set({ "hotkey-youtube_restart": false });
      }
    });
  };

  /**
   * Adds a new site to `sites` and generates the URL regex
   */
  Sitelist.prototype.addSite = function(siteKey, attributes) {
    var site = this.sites[siteKey];

    if(attributes.removedAlias && _.isArray(attributes.removedAlias)) {
      site.alias = _.xor(site.alias, attributes.removedAlias);
    }

    // Combine user defined site aliases with extension defined aliases
    attributes.alias = _.union(site.alias || [], attributes.alias || []);
    attributes.enabled =
      (typeof attributes.enabled === "undefined")
        ? (typeof site.enabled === "undefined")
          ? true
          : site.enabled
        : attributes.enabled;
    attributes.priority =
      (typeof attributes.priority === "undefined")
        ? (typeof site.priority === "undefined")
          ? 1
          : site.priority
        : attributes.priority;

    this.sites[siteKey] = _.extend(
      site,
      _.pick(attributes, this.validSiteAttributes),
      {
        enabled: attributes.enabled,
        priority: attributes.priority,
        urlRegex: new URLCheck(siteKey, { alias: attributes.alias, blacklist: site.blacklist })
      }
    );
  };

  /**
   * Set site enabled settings in localstorage
   * @param {String} siteKey - name of the hotkey-sites key in localstorage
   * @param {Object} value - value to set
   * @return {Promise}
   */
  Sitelist.prototype.setSiteStorage = function(siteKey, value) {
    var promise = new Promise(function(resolve, reject) {
      chrome.storage.sync.get(function(obj) {
        if(obj["hotkey-sites"]) {
          _.extend(obj["hotkey-sites"][siteKey], value);
          chrome.storage.sync.set({ "hotkey-sites": obj["hotkey-sites"] }, function() {
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
   * @param {String} siteName - site name to update
   * @param {Boolean} value - value object to set site to
   * @param {Function} callback
   */
  Sitelist.prototype.setSiteState = function(siteKey, value) {
    var that = this;

    var promise = new Promise(function(resolve) {
      that.addSite(siteKey, value);
      that.setSiteStorage(siteKey, value).then(function() {
        resolve();
      }, function() {
        resolve();
      });
    });

    return promise;
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
      return this.sites[name].urlRegex.test(url);
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
      var urlRegex = that.sites[sitelist_name].urlRegex;
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
          if(urlRegex.test(tab.url)) tab_ids.push(tab.id);
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
      return (_sites[sitename].urlRegex.test(url));
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
    var sitesRegex = _.map(this.sites, function(site) { return site.urlRegex; });

    return sitesRegex.some(function(urlRegex) {
      return (urlRegex.test(url));
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
    var siteName = this.getSitelistName(url);

    if(siteName) {
      var site = this.sites[siteName];
      if(site.controller) return site.controller;

      return (siteName[0].toUpperCase() + siteName.slice(1) + "Controller.js");
    }

    return null;
  };

  /**
   * @param {String} siteKey
   * @return {Number} priorty of site
   */
  Sitelist.prototype.getPriority = function(siteKey) {
    return this.sites[siteKey].priority;
  };

  /**
   * Gets an array of all tabs that are music tabs, ignoring whether they are active
   * @return {Promise}
   */
  Sitelist.prototype.getMusicTabs = function() {
    var that = this;

    var promise = new Promise(function(resolve) {
      var musicTabs = {
        enabled: [],
        disabled: []
      };

      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          if(that.checkEnabled(tab.url)) {
            tab.streamkeysSiteKey = that.getSitelistName(tab.url);
            tab.streamkeysPriority = that.getPriority(tab.streamkeysSiteKey);
            tab.streamkeysEnabled = that.checkTabEnabled(tab.id);
            musicTabs.enabled.push(tab);
          } else if(that.checkMusicSite(tab.url)) {
            tab.streamkeysSiteKey = that.getSitelistName(tab.url);
            tab.streamkeysPriority = that.getPriority(tab.streamkeysSiteKey);
            tab.streamkeysEnabled = false;
            musicTabs.disabled.push(tab);
          }
        });

        resolve(musicTabs);
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
      var musicTabs = [];

      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          if(that.checkEnabled(tab.url) && that.checkTabEnabled(tab.id)) {
            musicTabs.push({
              tab: tab,
              priority: that.getPriority(that.getSitelistName(tab.url))
            });
          }
        });

        if(musicTabs.length > 0) {
          var maxPriority = _.sortBy(musicTabs, function(tab) { return tab.priority * -1; })[0].priority;

          musicTabs = _.map(
            _.filter(
              musicTabs,
              function(tab) { return tab.priority == maxPriority; }
            ),
            function(musicTab) { return musicTab.tab; }
          );
        }

        resolve(musicTabs);
      });
    });

    return promise;
  };

  module.exports = Sitelist;
})();
