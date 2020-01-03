;(function() {
  "use strict";

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
      "7digital": { name: "7digital", url: "http://www.7digital.com" },
      "8tracks": { name: "8tracks", url: "http://www.8tracks.com" },
      "amazon": { name: "Amazon Cloud Player", url: "https://www.amazon.com/gp/dmusic/cloudplayer/player" },
      "ampache": { name: "Ampache", url: "http://ampache.org" },
      "accuradio": { name: "Accuradio", url: "https://www.accuradio.com" },
      "airsonic": { name: "AirSonic", url: "https://airsonic.github.io/"},
      "ambientsleepingpill": { name: "Ambient Sleeping Pill", url: "http://www.ambientsleepingpill.com" },
      "anghami": { name: "Anghami", url: "https://www.anghami.com" },
      "arena": { name: "Are.na", url: "https://www.are.na/", alias: ["are"] },
      "asoftmurmur": { name: "A Soft Murmur", url: "http://www.asoftmurmur.com" },
      "audible": { name: "Audible", url: "http://www.audible.com" },
      "audiotool": { name: "Audiotool", url: "https://www.audiotool.com/" },
      "bandcamp": { name: "Bandcamp", url: "http://www.bandcamp.com" },
      "bbc": { name: "BBC Radio", url: "http://www.bbc.co.uk/radio", controller: "BBCRadioController.js" },
      "be-at": { name: "BE-AT.TV", url: "https://be-at.tv", controller: "BeAtTvController.js"},
      "beatport": { name: "Beatport", url: "https://www.beatport.com" },
      "brain": { name: "BrainFM", url: "http://brain.fm", controller: "BrainFMController.js" },
      "castbox": { name: "Castbox", url: "https://castbox.fm", controller: "CastboxController.js" },
      "cloud.caster": { name: "Cloud Caster", url: "http://cloud-caster.com", controller: "CloudCasterController.js", alias: ["cloud-caster"] },
      "coursera": { name: "Coursera", url: "http://www.coursera.org" },
      "crave": { name: "Crave", url: "https://www.crave.ca", controller: "CraveController.js" },
      "deezer": { name: "Deezer", url: "http://www.deezer.com" },
      "demodrop": { name: "DemoDrop", url: "http://www.demodrop.com" },
      "di": { name: "Di.fm", url: "http://www.di.fm" },
      "disco": { name: "Disco.io", url: "http://www.disco.io" },
      "disi": { name: "Disi", url: "http://www.disi.co.il" },
      "driveplayer": { name: "Drive Player", url: "http://www.driveplayer.com" },
      "duckburgradio": { name: "Duckburg Radio", url: "http://beta.radio-mb.com", controller: "DuckburgRadioController.js", alias: ["radio-mb"] },
      "earbits": { name: "Earbits", url: "http://www.earbits.com" },
      "egghead": { name: "egghead.io", url: "https://egghead.io" },
      "embedded": { name: "Embedded Element", url: null, controller: "EmbeddedElementController.js" },
      "emby": { name: "Emby", url: "http://app.emby.media" },
      "feedly": { name: "Feedly", url: "http://www.feedly.com" },
      "focusatwill": { name: "focusatwill", url: "http://www.focusatwill.com", controller: "FocusatwillController.js" },
      "focusmusic": { name: "Focusmusic", url: "https://focusmusic.fm/" },
      "friskyradio": { name: "Frisky Radio", url: "https://www.friskyradio.com" },
      "gaana": { name: "Gaana", url: "http://www.gaana.com" },
      "giantbomb": { name: "Giantbomb", url: "http://giantbomb.com" },
      "phenopod": { name: "Phenopod", url: "https://phenopod.com" },
      "play.google": { name: "Google Play Music", url: "http://play.google.com", controller: "GoogleMusicController.js" },
      "playmoss": { name: "Playmoss", url: "http://www.playmoss.com" },
      "hearthis": { name: "HearThis.at", url: "http://www.hearthis.at" },
      "hoopla": { name: "Hoopla", url: "https://www.hoopladigital.com", alias:["hoopladigital"] },
      "hulu": { name: "Hulu", url: "https://www.hulu.com" },
      "hypem": { name: "Hypemachine", url: "http://www.hypem.com" },
      "hypster": { name: "Hypster", url: "http://www.hypster.com" },
      "ibroadcast": { name: "iBroadcast", url: "https://media.ibroadcast.com/" },
      "iheart": { name: "iHeartRadio", url: "http://www.iheart.com" },
      "imusic": { name: "iMusic", url: "https://imusic.am" },
      "indieshuffle": { name: "indieshuffle", url: "http://www.indieshuffle.com"},
      "ivoox": { name: "ivoox", url: "http://www.ivoox.com" },
      "jamendo": { name: "Jamendo", url: "https://www.jamendo.com" },
      "jango": { name: "Jango", url: "http://www.jango.com" },
      "jovemnerd": { name: "Jovem Nerd", url: "https://jovemnerd.com.br", controller: "JovemNerdController.js" },
      "koel": { name: "Koel", url: "https://koel.phanan.net" },
      "kollekt": { name: "Kollekt.fm", url: "http://www.kollekt.fm" },
      "last": { name: "LastFm", url: "http://www.last.fm", controller: "LastfmController.js", alias: ["lastfm"] },
      "lifestore-flat": { name: "Hofer life music", url: "https://app.lifestore-flat.at", controller: "HoferLifeMusicController.js" },
      "listenonrepeat": { name: "ListenOnRepeat", url: "http://www.listenonrepeat.com" },
      "logitechmediaserver": { name: "LogitechMediaServer", url: "http://mysqueezebox.com", controller: "LogitechMediaServerController.js", alias: ["mysqueezebox"] },
      "mixcloud": { name: "Mixcloud", url: "http://www.mixcloud.com" },
      "music.163": { name: "music.163", url: "http://music.163.com", controller: "163Controller.js"},
      "music.microsoft": { name: "Microsoft Groove", url: "http://music.microsoft.com", controller: "MicrosoftController.js" },
      "music.zacharyseguin": { name: "Zachary Seguin Music", "url": "https://music.zacharyseguin.ca", controller: "MusicKitJsController.js" },
      "musicforprogramming": { name: "Music for Programming", url: "https://musicforprogramming.net", controller: "MusicForProgrammingController.js" },
      "mycloudplayers": { name: "My Cloud Player", url: "http://www.mycloudplayers.com" },
      "mynoise" : { name: "myNoise", url : "https://mynoise.net" },
      "myspace": { name: "MySpace", url: "http://www.myspace.com" },
      "music.naver": { name: "Naver Music", url: "https://playerui.music.naver.com", controller: "NaverMusicController.js"},
      "napster": { name: "Napster", url: "https://app.napster.com", controller: "NapsterController.js" },
      "netflix": { name: "Netflix", url: "http://www.netflix.com" },
      "noise": { name: "NoiseSupply", url: "http://noise.supply", controller: "NoiseSupplyController.js" },
      "noisli": { name: "Noisli", url: "http://noisli.com", controller: "NoisliController.js" },
      "noonpacific": { name: "Noon Pacific", url: "http://www.noonpacific.com" },
      "www.npr": { name: "NPR Player", url: "http://www.npr.org", controller: "NprNewsController.js" },
      "overcast": { name: "Overcast.fm", url: "http://overcast.fm" },
      "palcomp3": { name: "Palco MP3", url: "http://palcomp3.com.br" },
      "pandora": { name: "Pandora", url: "http://www.pandora.com" },
      "patari": { name: "Patari", url: "http://patari.pk", alias: ["patari"] },
      "phishjustjams": { name: "Phish Just Jams", url: "http://phishjustjams.com" },
      "player": { name: "Player.fm", url: "http://player.fm", controller: "PlayerFmController.js", blacklist: ["player.spotify", "reddit.music.player.il", "reddit.musicplayer.io", "player.siriusxm.com"] },
      "pleer": { name: "Pleer", url: "http://pleer.com" },
      "plex": { name: "Plex", url: "http://www.plex.tv" },
      "pluralsight": { name: "Pluralsight", url: "https://app.pluralsight.com" },
      "pocketcasts": { name: "Pocketcasts", url: "https://play.pocketcasts.com" },
      "podster": { name: "Podster", url: "http://www.podster.fm" },
      "pogoplug": { name: "Pogoplug", url: "http://my.pogoplug.com/view" },
      "primevideo": {name: "Prime Video", url: "https://www.primevideo.com"},
      "qobuz": { name: "Qobuz", url: "https://play.qobuz.com" },
      "music.qq": { name: "QQ Music", url: "https://y.qq.com/portal/player.html", controller: "QQController.js", alias: ["y.qq.com/portal/player.html"] },
      "radioparadise": { name: "RadioParadise", url: "http://www.radioparadise.com" },
      "radioswissjazz": { name: "RadioSwissJazz", url: "http://www.radioswissjazz.ch" },
      "rainwave": { name: "Rainwave.cc", url: "http://www.rainwave.cc" },
      "reddit.music.player.il": { name: "Reddit Music Player", url: "http://reddit.music.player.il.ly", controller: "RedditMusicPlayerController.js", alias: ["reddit.musicplayer"] },
      "reverbnation": { name: "Reverb Nation", url: "http://www.reverbnation.com" },
      "jiosaavn": { name: "JioSaavn", url: "https://www.jiosaavn.com", controller: "JioSaavnController.js" },
      "seesu": { name: "Seesu.me", url: "http://www.seesu.me" },
      "shortorange": { name: "ShortOrange", url: "http://www.shortorange.com" },
      "siriusxm": { name: "SiriusXM", url: "https://player.siriusxm.com" },
      "slacker": { name: "Slacker", url: "http://www.slacker.com" },
      "somafm": { name: "SomaFM", url: "http://somafm.com", controller: "SomaFMController.js" },
      "songstr": { name: "Songstr", url: "http://www.songstr.com" },
      "songza": { name: "Songza", url: "http://www.songza.com" },
      "music.sonyentertainmentnetwork": { name: "Sony Music Unlimited", url: "https://music.sonyentertainmentnetwork.com", controller: "SonyMusicUnlimitedController.js" },
      "sound": { name: "Sound.is", url: "http://www.sound.is" },
      "soundcloud": { name: "Soundcloud", url: "http://www.soundcloud.com" },
      "soundredux": { name: "SoundRedux", url: "https://soundredux.io" },
      "soundsgood": { name: "Soundsgood.co", url: "http://www.soundsgood.co" },
      "spotify": { name: "Spotify Web Player", url: "http://www.spotify.com" },
      "spreaker": { name: "Spreaker", url: "http://www.spreaker.com" },
      "stitcher": { name: "Stitcher", url: "http://www.stitcher.com" },
      "streamelements": { name: "StreamElements", url: "https://streamelements.com/dashboard/songrequest/general" },
      "streamsquid": { name: "StreamSquid", url: "http://streamsquid.com/" },
      "subsonic": { name: "Subsonic", url: "http://www.subsonic.org" },
      "synology": { name: "Synology Audio Station", url: "https://www.synology.me", controller: "SynologyAudioStationController.js" },
      "tidal": { name: "Tidal", url: "https://www.tidal.com", alias: ["tidalhifi"] },
      "tunein": { name: "TuneIn", url: "http://www.tunein.com" },
      "twitch": { name: "Twitch.tv", url: "http://www.twitch.tv" },
      "udemy": { name: "Udemy", url: "https://www.udemy.com/" },
      "vibe": { name: "Vibe", url: "https://vibe.naver.com"},
      "vimeo": { name: "Vimeo", url: "https://vimeo.com" },
      "vk": { name: "Vkontakte", url: "http://www.vk.com" },
      "music.yandex": { name: "Yandex", url: "http://music.yandex.ru", controller: "YandexController.js" },
      "radio.yandex": { name: "Yandex Radio", url: "http://radio.yandex.ru", controller: "YandexRadioController.js" },
      "youarelistening": { name: "YouAreListening.to", url: "http://www.youarelistening.to", controller: "YouarelisteningtoController.js" },
      "xiami": { name: "Xiami", url: "http://www.xiami.com" },
      "music.youtube": { name: "YouTube Music", url: "https://music.youtube.com", controller: "YoutubeMusicController.js" },
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

      _.forEach(_.keys(that.sites), function(siteKey) {
        var siteDefaults = { enabled: true, priority: 1, alias: [], showNotifications: false };
        var siteObj =
          (version === 0)
            ? {
                enabled: objSet ? obj["hotkey-sites"][siteKey] || false : true,
                priority: 1,
                alias: [],
                showNotifications: false
              }
            : (objSet && obj["hotkey-sites"][siteKey])
              // Validate enabled/priority values in case of migration problems
              ? {
                  enabled: _.isBoolean(obj["hotkey-sites"][siteKey].enabled) ? obj["hotkey-sites"][siteKey].enabled : true,
                  priority: _.isNumber(obj["hotkey-sites"][siteKey].priority) ? obj["hotkey-sites"][siteKey].priority : 1,
                  alias: _.isArray(obj["hotkey-sites"][siteKey].alias) ? obj["hotkey-sites"][siteKey].alias : [],
                  showNotifications: _.isBoolean(obj["hotkey-sites"][siteKey].showNotifications) ? obj["hotkey-sites"][siteKey].showNotifications : false
                }
              : siteDefaults;

        that.addSite(
          siteKey,
          siteObj
        );

        // Delete properties that have default values to reduce storage space
        // For `chrome.storage.sync` API each item must be under 8kb
        _.forEach(_.keys(siteDefaults), function(property) {
          if(_.isEqual(siteObj[property], siteDefaults[property])) {
            delete siteObj[property];
          }
        });

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
      if(!obj.hasOwnProperty("hotkey-use_mpris")) {
        chrome.storage.sync.set({ "hotkey-use_mpris": false });
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
      site.alias = _.difference(site.alias, attributes.removedAlias);
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
    attributes.showNotifications =
      (typeof attributes.showNotifications === "undefined")
        ? (typeof site.showNotifications === "undefined")
          ? false
          : site.showNotifications
        : attributes.showNotifications;

    this.sites[siteKey] = _.assignIn(
      site,
      _.pickBy(attributes, this.validSiteAttributes),
      {
        enabled: attributes.enabled,
        priority: attributes.priority,
        showNotifications: attributes.showNotifications,
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
          _.assignIn(obj["hotkey-sites"][siteKey], value);
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
      _.pickBy(this.sites, function(site) {
        return site.enabled;
      })
    );
  };

  /**
   * @return {Array} array of showNotifications site keys
   */
  Sitelist.prototype.getShowNotifications = function() {
    return _.keys(
      _.pickBy(this.sites, function(site) {
        return site.showNotifications;
      })
    );
  };

  /**
   * Returns the sitelist key of a url if it is matched to a music site
   * @param {String} url - url to check
   * @return {String} sitelist key if found, null otherwise
   */
  Sitelist.prototype.getSitelistName = function(url) {
    var filtered_sites = _.filter(_.keys(this.sites), (function (name) {
      return this.sites[name].urlRegex.test(url);
    }).bind(this));

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
   * @param url {String} url of site to check for
   * @return {Boolean} true if url matches a showNotifications site
   */
  Sitelist.prototype.checkShowNotifications = function(url) {
    var _sites = this.sites;

    return this.getShowNotifications().some(function(sitename) {
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
