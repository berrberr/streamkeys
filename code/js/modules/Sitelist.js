;(function() {
  "use strict";

  var $ = require("jquery");

  //***
  //@return [RegExp] a regex that matches where the string is in a url's (domain) name
  //***
  var URL_check = function(domain) {
    return (new RegExp("^(http|https)*(:\/\/)*(.*\\.)*(" + domain + "|www." + domain +")+\\."));
  };

  //***
  //Base class for all sites enabled in extension
  //***
  var Sitelist = function() { return this; };

  Sitelist.prototype.init = function() {
    this.sites = {
      "7digital": {name: "7digital", url: "http://www.7digital.com", enabled: true, temp_disabled: false, url_regex: null},
      "8tracks": {name: "8tracks", url: "http://www.8tracks.com", enabled: true, temp_disabled: false, url_regex: null},
      "amazon": {name: "Amazon Cloud Player", url: "https://www.amazon.com/gp/dmusic/cloudplayer/player", enabled: true, temp_disabled: false, url_regex: null},
      "ambientsleepingpill": {name: "Ambient Sleeping Pill", url: "http://www.ambientsleepingpill.com", enabled: true, temp_disabled: false, url_regex: null},
      "bandcamp": {name: "Bandcamp", url: "http://www.bandcamp.com", enabled: true, temp_disabled: false, url_regex: null},
      "bop": {name: "Bop.fm", url: "http://www.bop.fm", enabled: true, temp_disabled: false, url_regex: null},
      "deezer": {name: "Deezer", url: "http://www.deezer.com", enabled: true, temp_disabled: false, url_regex: null},
      "di": {name: "Di.fm", url: "http://www.di.fm", enabled: true, temp_disabled: false, url_regex: null},
      "earbits": {name: "Earbits", url: "http://www.earbits.com", enabled: true, temp_disabled: false, url_regex: null},
      "player.edge": {name: "Edge Player", url: "http://player.edge.ca", enabled: true, temp_disabled: false, url_regex: null},
      "grooveshark": {name: "Grooveshark", url: "http://www.grooveshark.com", enabled: true, temp_disabled: false, url_regex: null},
      "hypem": {name: "Hypemachine", url: "http://www.hypem.com", enabled: true, temp_disabled: false, url_regex: null},
      "iheart": {name: "iHeartRadio", url: "http://www.iheart.com", enabled: true, temp_disabled: false, url_regex: null},
      "jango": {name: "Jango", url: "http://www.jango.com", enabled: true, temp_disabled: false, url_regex: null},
      "last": {name: "LastFm", url: "http://www.last.fm", enabled: true, temp_disabled: false, url_regex: null},
      "mixcloud": {name: "Mixcloud", url: "http://www.mixcloud.com", enabled: true, temp_disabled: false, url_regex: null},
      "music.sonyentertainmentnetwork": {name: "SonyMusicUnlimited", url: "https://music.sonyentertainmentnetwork.com", enabled: true, temp_disabled: false, url_regex: null},
      "myspace": {name: "MySpace", url: "http://www.myspace.com", enabled: true, temp_disabled: false, url_regex: null},
      "npr": {name: "NPR One Player", url: "http://one.npr.org", enabled: true, temp_disabled: false, url_regex: null},
      "oplayer": {name: "oPlayer", url: "http://oplayer.org", enabled: true, temp_disabled: false, url_regex: null},
      "pandora": {name: "Pandora", url: "http://www.pandora.com", enabled: true, temp_disabled: false, url_regex: null},
      "pocketcasts": {name: "Pocketcasts", url: "https://play.pocketcasts.com", enabled: true, temp_disabled: false, url_regex: null},
      "plex": {name: "Plex", url: "http://www.plex.tv", enabled: true, temp_disabled: false, url_regex: null},
      "pleer": {name: "Pleer.com", url: "http://pleer.com", enabled: true, temp_disabled: false, url_regex: null},
      "play.google": {name: "Google Music", url: "http://play.google.com", enabled: true, temp_disabled: false, url_regex: null},
      "radioparadise": {name: "RadioParadise", url: "http://www.radioparadise.com", enabled: true, temp_disabled: false, url_regex: null},
      "rdio": {name: "Rdio", url: "http://www.rdio.com", enabled: true, temp_disabled: false, url_regex: null},
      "seesu": {name: "Seesu.me", url: "http://www.seesu.me", enabled: true, temp_disabled: false, url_regex: null},
      "spotify": {name: "Spotify Web Player", url: "http://www.spotify.com", enabled: true, temp_disabled: false, url_regex: null},
      "soundcloud": {name: "Soundcloud", url: "http://www.soundcloud.com", enabled: true, temp_disabled: false, url_regex: null},
      "songstr": {name: "Songstr", url: "http://www.songstr.com", enabled: true, temp_disabled: false, url_regex: null},
      "songza": {name: "Songza", url: "http://www.songza.com", enabled: true, temp_disabled: false, url_regex: null},
      "slacker": {name: "Slacker", url: "http://www.slacker.com", enabled: true, temp_disabled: false, url_regex: null},
      "stitcher": {name: "Stitcher", url: "http://www.stitcher.com", enabled: true, temp_disabled: false, url_regex: null},
      "tunein": {name: "TuneIn", url: "http://www.tunein.com", enabled: true, temp_disabled: false, url_regex: null},
      "thesixtyone": {name: "TheSixtyOne", url: "http://www.thesixtyone.com", enabled: true, temp_disabled: false, url_regex: null},
      "vk": {name: "Vkontakte", url: "http://www.vk.com", enabled: true, temp_disabled: false, url_regex: null},
      "yandex": {name: "Yandex", url: "http://music.yandex.ru", enabled: true, temp_disabled: false, url_regex: null},
      "youarelistening": {name: "YouAreListening.to", url: "http://www.youarelistening.to", enabled: true, temp_disabled: false, url_regex: null},
      "youtube": {name: "YouTube", url: "http://www.youtube.com", enabled: true, temp_disabled: false, url_regex: null}
    };
  };

  //Get site settings from localstorage
  Sitelist.prototype.load_settings = function() {
    var self = this;
    if(!this.sites) this.init();
    console.log(this);
    chrome.storage.local.get(function(obj) {
      var objSet = obj.hasOwnProperty("hotkey-sites");
      $.each(self.sites, function(key) {
        if(objSet && (typeof obj["hotkey-sites"][key] !== "undefined")) self.sites[key].enabled = obj["hotkey-sites"][key];
        self.sites[key].url_regex = new URL_check(key);
      });
    });
  };

  //@return [arr] enabled sites
  Sitelist.prototype.get_enabled = function() {
    return $.map(this.sites, function(val, key) {
      if(val.enabled) return key;
    });
  };

  //@param url [str] url of site to check for
  //@return [bool] true if url matches an enabled site
  Sitelist.prototype.check_enabled = function(url) {
    var _sites = this.sites;
    return this.get_enabled().some(function(sitename) {
      return (_sites[sitename].url_regex.test(url));
    });
  };

  //@param url [str] url of site to check for temporarily disabled
  //@return [bool] true if url matches an temporarily disabled site
  Sitelist.prototype.check_temp_disabled = function(url) {
    var _sites = this.sites;
    var filtered_sites = $.grep(Object.keys(_sites), function (name) {
      return window.sk_sites.sites[name].url_regex.test(url);
    });

    if (!filtered_sites.length) { return; }

    var site_name   = filtered_sites[0];
    var site_by_url = window.sk_sites.sites[site_name];

    return (site_by_url.temp_disabled === true);
  };

  //@param url [str] url of site to mark as temporarily disabled
  Sitelist.prototype.markAsTemporarilyDisabled = function(url, is_checked) {
    console.log(url);
    var is_disabled = !is_checked;

    var filtered_sites = $.grep(Object.keys(window.sk_sites.sites), function (name) {
      return window.sk_sites.sites[name].url_regex.test(url);
    });

    if (!filtered_sites.length) { return; }

    var site_name   = filtered_sites[0];
    var site_by_url = window.sk_sites.sites[site_name];
    site_by_url.temp_disabled = is_disabled;

    window.sk_sites.sites[site_name] = site_by_url;
    chrome.storage.local.set({"hotkey-sites": window.sk_sites.sites});
  };

  //***
  //When Sitelist is required create a new singleton and return that
  //Note: This makes all methods/properties of Sitelist publicly exposed
  //***
  var singleton = new Sitelist();
  module.exports = singleton;
})();
