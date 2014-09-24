(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

//***
//@return [RegExp] a regex that matches where the string is in a url's (domain) name
//***
var URL_check = function(domain) {
  return (new RegExp("^(http|https)*(:\/\/)*(.*\\.)*(" + domain + "|www." + domain +")+\\."));
};

//***
//Base class for all sites enabled in extension
//***
var Sitelist = function()
{
  this.sites = {
    "7digital": {name: "7digital", url: "http://www.7digital.com", enabled: true, url_regex: null},
    "8tracks": {name: "8tracks", url: "http://www.8tracks.com", enabled: true, url_regex: null},
    "amazon": {name: "Amazon Cloud Player", url: "https://www.amazon.com/gp/dmusic/cloudplayer/player", enabled: true, url_regex: null},
    "bandcamp": {name: "Bandcamp", url: "http://www.bandcamp.com", enabled: true, url_regex: null},
    "bop": {name: "Bop.fm", url: "http://www.bop.fm", enabled: true, url_regex: null},
    "deezer": {name: "Deezer", url: "http://www.deezer.com", enabled: true, url_regex: null},
    "di": {name: "Di.fm", url: "http://www.di.fm", enabled: true, url_regex: null},
    "earbits": {name: "Earbits", url: "http://www.earbits.com", enabled: true, url_regex: null},
    "player.edge": {name: "Edge Player", url: "http://player.edge.ca", enabled: true, url_regex: null},
    "grooveshark": {name: "Grooveshark", url: "http://www.grooveshark.com", enabled: true, url_regex: null},
    "hypem": {name: "Hypemachine", url: "http://www.hypem.com", enabled: true, url_regex: null},
    "iheart": {name: "iHeartRadio", url: "http://www.iheart.com", enabled: true, url_regex: null},
    "jango": {name: "Jango", url: "http://www.jango.com", enabled: true, url_regex: null},
    "last": {name: "LastFm", url: "http://www.last.fm", enabled: true, url_regex: null},
    "mixcloud": {name: "Mixcloud", url: "http://www.mixcloud.com", enabled: true, url_regex: null},
    "music.sonyentertainmentnetwork": {name: "SonyMusicUnlimited", url: "https://music.sonyentertainmentnetwork.com", enabled: true, url_regex: null},
    "myspace": {name: "MySpace", url: "http://www.myspace.com", enabled: true, url_regex: null},
    "npr": {name: "NPR One Player", url: "http://one.npr.org", enabled: true, url_regex: null},
    "pandora": {name: "Pandora", url: "http://www.pandora.com", enabled: true, url_regex: null},
    "plex": {name: "Plex", url: "http://www.plex.tv", enabled: true, url_regex: null},
    "pleer": {name: "Pleer.com", url: "http://pleer.com", enabled: true, url_regex: null},
    "play.google": {name: "Google Music", url: "http://play.google.com", enabled: true, url_regex: null},
    "radioparadise": {name: "RadioParadise", url: "http://www.radioparadise.com", enabled: true, url_regex: null},
    "rdio": {name: "Rdio", url: "http://www.rdio.com", enabled: true, url_regex: null},
    "seesu": {name: "Seesu.me", url: "http://www.seesu.me", enabled: true, url_regex: null},
    "spotify": {name: "Spotify Web Player", url: "http://www.spotify.com", enabled: true, url_regex: null},
    "soundcloud": {name: "Soundcloud", url: "http://www.soundcloud.com", enabled: true, url_regex: null},
    "songstr": {name: "Songstr", url: "http://www.songstr.com", enabled: true, url_regex: null},
    "songza": {name: "Songza", url: "http://www.songza.com", enabled: true, url_regex: null},
    "slacker": {name: "Slacker", url: "http://www.slacker.com", enabled: true, url_regex: null},
    "stitcher": {name: "Stitcher", url: "http://www.stitcher.com", enabled: true, url_regex: null},
    "tunein": {name: "TuneIn", url: "http://www.tunein.com", enabled: true, url_regex: null},
    "thesixtyone": {name: "TheSixtyOne", url: "http://www.thesixtyone.com", enabled: true, url_regex: null},
    "vk": {name: "Vkontakte", url: "http://www.vk.com", enabled: true, url_regex: null},
    "youarelistening": {name: "YouAreListening.to", url: "http://www.youarelistening.to", enabled: true, url_regex: null},
    "youtube": {name: "YouTube", url: "http://www.youtube.com", enabled: false, url_regex: null}
  };

  //Get site settings from localstorage
  this.load_settings = function() {
    var self = this;
    chrome.storage.local.get(function(obj) {
      var objSet = obj.hasOwnProperty("hotkey-sites");
      $.each(self.sites, function(key) {
        if(objSet && (typeof obj["hotkey-sites"][key] !== "undefined")) self.sites[key].enabled = obj["hotkey-sites"][key];
        self.sites[key].url_regex = new URL_check(key);
      });
    });
  };

  //@return [arr] enabled sites
  this.get_enabled = function() {
    return $.map(this.sites, function(val, key) {
      if(val.enabled) return key;
    });
  };

  //@param url [str] url of site to check for
  //@return [bool] true if url matches an enabled site
  this.check_enabled = function(url) {
    var _sites = this.sites;
    return this.get_enabled().some(function(sitename) {
      return (_sites[sitename].url_regex.test(url));
    });
  };
};

//***
//Capture hotkeys and send their actions to tab(s) with music player running
//***
chrome.commands.onCommand.addListener(function(command) {
  //chrome.runtime.sendMessage({"action": command});
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      if(window.sk_sites.check_enabled(tab.url)) {
        chrome.tabs.sendMessage(tab.id, {"action": command});
        console.log("SENT " + command + " TO " + tab.url);
      }
    });
  });
});

//***
//Messages sent from Options page
//***
chrome.runtime.onMessage.addListener(function(request, sender, response) {
  if(request.action === "update_keys") {
    console.log("Options page has updated settings. Reloading...");
    window.sk_sites.load_settings();
  }
  if(request.action === "get_sites") {
    console.log("Options page wants the sitelist.");
    response(window.sk_sites.sites);
  }
  if(request.action === "get_commands") {
    response(window.coms);
  }
});

//***
//Open info page on install/update
//***
chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason == "install") {
    //Only open the site if not already on it
    //streamkeys-install session var will be created on click of install button on streamkeys site
    //TODO: figure out how to make this work
    //var fromSite = sessionStorage.getItem("streamkeys-install");
    //if(fromSite === null)
    //chrome.tabs.create({url: "http://www.streamkeys.com/guide.html?installed=true"});
  } else if(details.reason == "update") {
    //chrome.tabs.create({url: "http://www.streamkeys.com/guide.html?updated=true"});
  }
});

//***
//Define sk_sites as a sitelist in global context
//***
(function() {
  window.sk_sites = new Sitelist();
  window.sk_sites.load_settings();
  chrome.commands.getAll(function(cmds) {
    window.coms = cmds;
  });
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9iYWNrZ3JvdW5kL2JhY2tncm91bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vKioqXG4vL0ByZXR1cm4gW1JlZ0V4cF0gYSByZWdleCB0aGF0IG1hdGNoZXMgd2hlcmUgdGhlIHN0cmluZyBpcyBpbiBhIHVybCdzIChkb21haW4pIG5hbWVcbi8vKioqXG52YXIgVVJMX2NoZWNrID0gZnVuY3Rpb24oZG9tYWluKSB7XG4gIHJldHVybiAobmV3IFJlZ0V4cChcIl4oaHR0cHxodHRwcykqKDpcXC9cXC8pKiguKlxcXFwuKSooXCIgKyBkb21haW4gKyBcInx3d3cuXCIgKyBkb21haW4gK1wiKStcXFxcLlwiKSk7XG59O1xuXG4vLyoqKlxuLy9CYXNlIGNsYXNzIGZvciBhbGwgc2l0ZXMgZW5hYmxlZCBpbiBleHRlbnNpb25cbi8vKioqXG52YXIgU2l0ZWxpc3QgPSBmdW5jdGlvbigpXG57XG4gIHRoaXMuc2l0ZXMgPSB7XG4gICAgXCI3ZGlnaXRhbFwiOiB7bmFtZTogXCI3ZGlnaXRhbFwiLCB1cmw6IFwiaHR0cDovL3d3dy43ZGlnaXRhbC5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcIjh0cmFja3NcIjoge25hbWU6IFwiOHRyYWNrc1wiLCB1cmw6IFwiaHR0cDovL3d3dy44dHJhY2tzLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwiYW1hem9uXCI6IHtuYW1lOiBcIkFtYXpvbiBDbG91ZCBQbGF5ZXJcIiwgdXJsOiBcImh0dHBzOi8vd3d3LmFtYXpvbi5jb20vZ3AvZG11c2ljL2Nsb3VkcGxheWVyL3BsYXllclwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwiYmFuZGNhbXBcIjoge25hbWU6IFwiQmFuZGNhbXBcIiwgdXJsOiBcImh0dHA6Ly93d3cuYmFuZGNhbXAuY29tXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJib3BcIjoge25hbWU6IFwiQm9wLmZtXCIsIHVybDogXCJodHRwOi8vd3d3LmJvcC5mbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwiZGVlemVyXCI6IHtuYW1lOiBcIkRlZXplclwiLCB1cmw6IFwiaHR0cDovL3d3dy5kZWV6ZXIuY29tXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJkaVwiOiB7bmFtZTogXCJEaS5mbVwiLCB1cmw6IFwiaHR0cDovL3d3dy5kaS5mbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwiZWFyYml0c1wiOiB7bmFtZTogXCJFYXJiaXRzXCIsIHVybDogXCJodHRwOi8vd3d3LmVhcmJpdHMuY29tXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJwbGF5ZXIuZWRnZVwiOiB7bmFtZTogXCJFZGdlIFBsYXllclwiLCB1cmw6IFwiaHR0cDovL3BsYXllci5lZGdlLmNhXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJncm9vdmVzaGFya1wiOiB7bmFtZTogXCJHcm9vdmVzaGFya1wiLCB1cmw6IFwiaHR0cDovL3d3dy5ncm9vdmVzaGFyay5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcImh5cGVtXCI6IHtuYW1lOiBcIkh5cGVtYWNoaW5lXCIsIHVybDogXCJodHRwOi8vd3d3Lmh5cGVtLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwiaWhlYXJ0XCI6IHtuYW1lOiBcImlIZWFydFJhZGlvXCIsIHVybDogXCJodHRwOi8vd3d3LmloZWFydC5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcImphbmdvXCI6IHtuYW1lOiBcIkphbmdvXCIsIHVybDogXCJodHRwOi8vd3d3LmphbmdvLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwibGFzdFwiOiB7bmFtZTogXCJMYXN0Rm1cIiwgdXJsOiBcImh0dHA6Ly93d3cubGFzdC5mbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwibWl4Y2xvdWRcIjoge25hbWU6IFwiTWl4Y2xvdWRcIiwgdXJsOiBcImh0dHA6Ly93d3cubWl4Y2xvdWQuY29tXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJtdXNpYy5zb255ZW50ZXJ0YWlubWVudG5ldHdvcmtcIjoge25hbWU6IFwiU29ueU11c2ljVW5saW1pdGVkXCIsIHVybDogXCJodHRwczovL211c2ljLnNvbnllbnRlcnRhaW5tZW50bmV0d29yay5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcIm15c3BhY2VcIjoge25hbWU6IFwiTXlTcGFjZVwiLCB1cmw6IFwiaHR0cDovL3d3dy5teXNwYWNlLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwibnByXCI6IHtuYW1lOiBcIk5QUiBPbmUgUGxheWVyXCIsIHVybDogXCJodHRwOi8vb25lLm5wci5vcmdcIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcInBhbmRvcmFcIjoge25hbWU6IFwiUGFuZG9yYVwiLCB1cmw6IFwiaHR0cDovL3d3dy5wYW5kb3JhLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwicGxleFwiOiB7bmFtZTogXCJQbGV4XCIsIHVybDogXCJodHRwOi8vd3d3LnBsZXgudHZcIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcInBsZWVyXCI6IHtuYW1lOiBcIlBsZWVyLmNvbVwiLCB1cmw6IFwiaHR0cDovL3BsZWVyLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwicGxheS5nb29nbGVcIjoge25hbWU6IFwiR29vZ2xlIE11c2ljXCIsIHVybDogXCJodHRwOi8vcGxheS5nb29nbGUuY29tXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJyYWRpb3BhcmFkaXNlXCI6IHtuYW1lOiBcIlJhZGlvUGFyYWRpc2VcIiwgdXJsOiBcImh0dHA6Ly93d3cucmFkaW9wYXJhZGlzZS5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcInJkaW9cIjoge25hbWU6IFwiUmRpb1wiLCB1cmw6IFwiaHR0cDovL3d3dy5yZGlvLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwic2Vlc3VcIjoge25hbWU6IFwiU2Vlc3UubWVcIiwgdXJsOiBcImh0dHA6Ly93d3cuc2Vlc3UubWVcIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcInNwb3RpZnlcIjoge25hbWU6IFwiU3BvdGlmeSBXZWIgUGxheWVyXCIsIHVybDogXCJodHRwOi8vd3d3LnNwb3RpZnkuY29tXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJzb3VuZGNsb3VkXCI6IHtuYW1lOiBcIlNvdW5kY2xvdWRcIiwgdXJsOiBcImh0dHA6Ly93d3cuc291bmRjbG91ZC5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcInNvbmdzdHJcIjoge25hbWU6IFwiU29uZ3N0clwiLCB1cmw6IFwiaHR0cDovL3d3dy5zb25nc3RyLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwic29uZ3phXCI6IHtuYW1lOiBcIlNvbmd6YVwiLCB1cmw6IFwiaHR0cDovL3d3dy5zb25nemEuY29tXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJzbGFja2VyXCI6IHtuYW1lOiBcIlNsYWNrZXJcIiwgdXJsOiBcImh0dHA6Ly93d3cuc2xhY2tlci5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcInN0aXRjaGVyXCI6IHtuYW1lOiBcIlN0aXRjaGVyXCIsIHVybDogXCJodHRwOi8vd3d3LnN0aXRjaGVyLmNvbVwiLCBlbmFibGVkOiB0cnVlLCB1cmxfcmVnZXg6IG51bGx9LFxuICAgIFwidHVuZWluXCI6IHtuYW1lOiBcIlR1bmVJblwiLCB1cmw6IFwiaHR0cDovL3d3dy50dW5laW4uY29tXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJ0aGVzaXh0eW9uZVwiOiB7bmFtZTogXCJUaGVTaXh0eU9uZVwiLCB1cmw6IFwiaHR0cDovL3d3dy50aGVzaXh0eW9uZS5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcInZrXCI6IHtuYW1lOiBcIlZrb250YWt0ZVwiLCB1cmw6IFwiaHR0cDovL3d3dy52ay5jb21cIiwgZW5hYmxlZDogdHJ1ZSwgdXJsX3JlZ2V4OiBudWxsfSxcbiAgICBcInlvdWFyZWxpc3RlbmluZ1wiOiB7bmFtZTogXCJZb3VBcmVMaXN0ZW5pbmcudG9cIiwgdXJsOiBcImh0dHA6Ly93d3cueW91YXJlbGlzdGVuaW5nLnRvXCIsIGVuYWJsZWQ6IHRydWUsIHVybF9yZWdleDogbnVsbH0sXG4gICAgXCJ5b3V0dWJlXCI6IHtuYW1lOiBcIllvdVR1YmVcIiwgdXJsOiBcImh0dHA6Ly93d3cueW91dHViZS5jb21cIiwgZW5hYmxlZDogZmFsc2UsIHVybF9yZWdleDogbnVsbH1cbiAgfTtcblxuICAvL0dldCBzaXRlIHNldHRpbmdzIGZyb20gbG9jYWxzdG9yYWdlXG4gIHRoaXMubG9hZF9zZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgb2JqU2V0ID0gb2JqLmhhc093blByb3BlcnR5KFwiaG90a2V5LXNpdGVzXCIpO1xuICAgICAgJC5lYWNoKHNlbGYuc2l0ZXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZihvYmpTZXQgJiYgKHR5cGVvZiBvYmpbXCJob3RrZXktc2l0ZXNcIl1ba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikpIHNlbGYuc2l0ZXNba2V5XS5lbmFibGVkID0gb2JqW1wiaG90a2V5LXNpdGVzXCJdW2tleV07XG4gICAgICAgIHNlbGYuc2l0ZXNba2V5XS51cmxfcmVnZXggPSBuZXcgVVJMX2NoZWNrKGtleSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvL0ByZXR1cm4gW2Fycl0gZW5hYmxlZCBzaXRlc1xuICB0aGlzLmdldF9lbmFibGVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICQubWFwKHRoaXMuc2l0ZXMsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICBpZih2YWwuZW5hYmxlZCkgcmV0dXJuIGtleTtcbiAgICB9KTtcbiAgfTtcblxuICAvL0BwYXJhbSB1cmwgW3N0cl0gdXJsIG9mIHNpdGUgdG8gY2hlY2sgZm9yXG4gIC8vQHJldHVybiBbYm9vbF0gdHJ1ZSBpZiB1cmwgbWF0Y2hlcyBhbiBlbmFibGVkIHNpdGVcbiAgdGhpcy5jaGVja19lbmFibGVkID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIF9zaXRlcyA9IHRoaXMuc2l0ZXM7XG4gICAgcmV0dXJuIHRoaXMuZ2V0X2VuYWJsZWQoKS5zb21lKGZ1bmN0aW9uKHNpdGVuYW1lKSB7XG4gICAgICByZXR1cm4gKF9zaXRlc1tzaXRlbmFtZV0udXJsX3JlZ2V4LnRlc3QodXJsKSk7XG4gICAgfSk7XG4gIH07XG59O1xuXG4vLyoqKlxuLy9DYXB0dXJlIGhvdGtleXMgYW5kIHNlbmQgdGhlaXIgYWN0aW9ucyB0byB0YWIocykgd2l0aCBtdXNpYyBwbGF5ZXIgcnVubmluZ1xuLy8qKipcbmNocm9tZS5jb21tYW5kcy5vbkNvbW1hbmQuYWRkTGlzdGVuZXIoZnVuY3Rpb24oY29tbWFuZCkge1xuICAvL2Nocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcImFjdGlvblwiOiBjb21tYW5kfSk7XG4gIGNocm9tZS50YWJzLnF1ZXJ5KHt9LCBmdW5jdGlvbih0YWJzKSB7XG4gICAgdGFicy5mb3JFYWNoKGZ1bmN0aW9uKHRhYikge1xuICAgICAgaWYod2luZG93LnNrX3NpdGVzLmNoZWNrX2VuYWJsZWQodGFiLnVybCkpIHtcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7XCJhY3Rpb25cIjogY29tbWFuZH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNFTlQgXCIgKyBjb21tYW5kICsgXCIgVE8gXCIgKyB0YWIudXJsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcblxuLy8qKipcbi8vTWVzc2FnZXMgc2VudCBmcm9tIE9wdGlvbnMgcGFnZVxuLy8qKipcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHJlc3BvbnNlKSB7XG4gIGlmKHJlcXVlc3QuYWN0aW9uID09PSBcInVwZGF0ZV9rZXlzXCIpIHtcbiAgICBjb25zb2xlLmxvZyhcIk9wdGlvbnMgcGFnZSBoYXMgdXBkYXRlZCBzZXR0aW5ncy4gUmVsb2FkaW5nLi4uXCIpO1xuICAgIHdpbmRvdy5za19zaXRlcy5sb2FkX3NldHRpbmdzKCk7XG4gIH1cbiAgaWYocmVxdWVzdC5hY3Rpb24gPT09IFwiZ2V0X3NpdGVzXCIpIHtcbiAgICBjb25zb2xlLmxvZyhcIk9wdGlvbnMgcGFnZSB3YW50cyB0aGUgc2l0ZWxpc3QuXCIpO1xuICAgIHJlc3BvbnNlKHdpbmRvdy5za19zaXRlcy5zaXRlcyk7XG4gIH1cbiAgaWYocmVxdWVzdC5hY3Rpb24gPT09IFwiZ2V0X2NvbW1hbmRzXCIpIHtcbiAgICByZXNwb25zZSh3aW5kb3cuY29tcyk7XG4gIH1cbn0pO1xuXG4vLyoqKlxuLy9PcGVuIGluZm8gcGFnZSBvbiBpbnN0YWxsL3VwZGF0ZVxuLy8qKipcbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uKGRldGFpbHMpIHtcbiAgaWYoZGV0YWlscy5yZWFzb24gPT0gXCJpbnN0YWxsXCIpIHtcbiAgICAvL09ubHkgb3BlbiB0aGUgc2l0ZSBpZiBub3QgYWxyZWFkeSBvbiBpdFxuICAgIC8vc3RyZWFta2V5cy1pbnN0YWxsIHNlc3Npb24gdmFyIHdpbGwgYmUgY3JlYXRlZCBvbiBjbGljayBvZiBpbnN0YWxsIGJ1dHRvbiBvbiBzdHJlYW1rZXlzIHNpdGVcbiAgICAvL1RPRE86IGZpZ3VyZSBvdXQgaG93IHRvIG1ha2UgdGhpcyB3b3JrXG4gICAgLy92YXIgZnJvbVNpdGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwic3RyZWFta2V5cy1pbnN0YWxsXCIpO1xuICAgIC8vaWYoZnJvbVNpdGUgPT09IG51bGwpXG4gICAgLy9jaHJvbWUudGFicy5jcmVhdGUoe3VybDogXCJodHRwOi8vd3d3LnN0cmVhbWtleXMuY29tL2d1aWRlLmh0bWw/aW5zdGFsbGVkPXRydWVcIn0pO1xuICB9IGVsc2UgaWYoZGV0YWlscy5yZWFzb24gPT0gXCJ1cGRhdGVcIikge1xuICAgIC8vY2hyb21lLnRhYnMuY3JlYXRlKHt1cmw6IFwiaHR0cDovL3d3dy5zdHJlYW1rZXlzLmNvbS9ndWlkZS5odG1sP3VwZGF0ZWQ9dHJ1ZVwifSk7XG4gIH1cbn0pO1xuXG4vLyoqKlxuLy9EZWZpbmUgc2tfc2l0ZXMgYXMgYSBzaXRlbGlzdCBpbiBnbG9iYWwgY29udGV4dFxuLy8qKipcbihmdW5jdGlvbigpIHtcbiAgd2luZG93LnNrX3NpdGVzID0gbmV3IFNpdGVsaXN0KCk7XG4gIHdpbmRvdy5za19zaXRlcy5sb2FkX3NldHRpbmdzKCk7XG4gIGNocm9tZS5jb21tYW5kcy5nZXRBbGwoZnVuY3Rpb24oY21kcykge1xuICAgIHdpbmRvdy5jb21zID0gY21kcztcbiAgfSk7XG59KSgpO1xuIl19
