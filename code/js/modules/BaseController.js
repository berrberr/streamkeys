"use strict";
(function () {
  var sk_log = require("../modules/SKLog.js");

  function BaseController(options) {
    this.siteName = options.siteName || null;

    this.selectors = {
      //** Properties **//
      playPause: (options.playPause || null),
      play: (options.play || null),
      pause: (options.pause || null),
      playNext: (options.playNext || null),
      playPrev: (options.playPrev || null),
      mute: (options.mute || null),
      like: (options.like || null),
      dislike: (options.dislike || null),
      iframe: (options.iframe || null),
      media: (options.media || null),

      //** States **//
      playState: (options.playState || null),

      //** Song Info **//
      song: (options.song || null),
      artist: (options.artist || null),
      album: (options.album || null),
      art: (options.art || null),
      currentTime: (options.currentTime || null),
      totalTime: (options.totalTime || null)
    };

    // Any property that's a function, turn it into a getter
    Object.defineProperties(
      this.selectors,
      Object.keys(this.selectors)
        .reduce(function (properties, key) {
          var fn = this.selectors[key];
          if (typeof fn === "function") {
            properties[key] = {
              get: fn.bind(this)
            };
          }
          return properties;
        }.bind(this), {}));

    this.canGetMedia = options.media != undefined || options.canGetMedia || false;

    this.canMute = options.canMute || options.mute != undefined || this.canGetMedia || false;
    if (options.canMute == false) this.canMute = false; // disable if explicitly set to false

    this.canSeek = options.canSeek || this.canGetMedia || false;
    if (options.canSeek == false) this.canSeek = false; // disable if explicitly set to false

    this.canSetVolume = options.canSetVolume || this.canGetMedia || false;
    if (options.canSetVolume == false) this.canSetVolume = false; // disable if explicitly set to false

    // Volume if possible/most recent, since mute changes the volume?
    this.volume = this.getVolume();
    if (this.volume == undefined) {
      // we are probably muted, so we unmute, get data and mute
      this.mute();
      this.getVolume();
      this.mute();
    }

    // Previous player state, used to check vs current player state to see if anything changed
    this.oldState = {};

    // Set to true if the play/pause buttons share the same element
    this.buttonSwitch = options.buttonSwitch || false;

    // Default listener sends actions to main document
    this.attachListeners();

    // Set to true if the tab should be hidden from the popup unless it has a playPause element shown
    this.hidePlayer = options.hidePlayer || false;

    //** Overrides for popup buttons **//
    this.overridePlayPrev = options.overridePlayPrev || false;
    this.overridePlayPause = options.overridePlayPause || false;
    this.overridePlayNext = options.overridePlayNext || false;

    chrome.runtime.sendMessage({ created: true }, function () {
      sk_log("SK content script loaded");
    });
  }

  BaseController.prototype.doc = function () {
    var returnDoc = document;
    if (this.selectors.iframe) {
      if (document.querySelector(this.selectors.iframe)) {
        if (document.querySelector(this.selectors.iframe).tagName.indexOf("FRAME") > -1) {
          returnDoc = document.querySelector(this.selectors.iframe).contentWindow.document;
        }
      }
    }
    return returnDoc;
  };

  BaseController.prototype.getMedia = function () {
    if (this.canGetMedia) {
      return this.doc().querySelector(this.selectors.media);
    }
  };

  /**
   * Inject a script into the current document
   * @param {String} file.url - /relative/path/to/script
   * @param {String} file.script - plaintext script as a string
   */
  BaseController.prototype.injectScript = function (file) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    if (file.url) { script.setAttribute("src", chrome.extension.getURL(file.url)); }
    if (file.script) { script.innerHTML = file.script; }
    (document.head || document.documentElement).appendChild(script);
  };

  /**
   * Click inside document
   * @param {String} opts.selectorButton - css selector for button to click
   * @param {String} opts.action - name of action to log to console for debugging purposes
   * @param {String} [opts.selectorFrame] - css selector for iframe to send clicks to
   */
  BaseController.prototype.click = function (opts) {
    opts = opts || {};
    if (opts.selectorButton === null) {
      sk_log("disabled", opts.action);
      return;
    }

    try {
      this.doc().querySelector(opts.selectorButton).click();
      sk_log(opts.action);
    } catch (e) {
      sk_log("Element not found for click.", opts.selectorButton, true);
    }

    // Update the player state after a click
    this.updatePlayerState();
  };

  BaseController.prototype.playPause = function () {
    if (this.selectors.play !== null && this.selectors.pause !== null) {
      if (this.isPlaying()) {
        this.click({ action: "playPause", selectorButton: this.selectors.pause, selectorFrame: this.selectors.iframe });
      } else {
        this.click({ action: "playPause", selectorButton: this.selectors.play, selectorFrame: this.selectors.iframe });
      }
    } else if (this.selectors.playPause !== null) {
      this.click({ action: "playPause", selectorButton: this.selectors.playPause, selectorFrame: this.selectors.iframe });
    } else if (this.canGetMedia) {
      var media = this.getMedia();
      if (media) {
        if (this.isPlaying()) {
          media.pause();
        } else {
          media.play();
        }
      }
    }
  };

  BaseController.prototype.playNext = function () {
    this.click({ action: "playNext", selectorButton: this.selectors.playNext, selectorFrame: this.selectors.iframe });
  };

  BaseController.prototype.playPrev = function () {
    this.click({ action: "playPrev", selectorButton: this.selectors.playPrev, selectorFrame: this.selectors.iframe });
  };

  BaseController.prototype.stop = function () {
    if (this.isPlaying()) this.playPause();
  };

  BaseController.prototype.mute = function () {
    // TODO: volume of media tab and website state is different
    if (this.selectors.mute) {
      this.click({ action: "mute", selectorButton: this.selectors.mute, selectorFrame: this.selectors.iframe });
    } else if (this.canGetMedia) {
      var media = this.getMedia();
      if (media) {
        media.muted = !media.muted;
      }
    }
    if (this.canSetVolume && this.volume != undefined) {
      this.setVolume(this.volume);
    }
  };

  BaseController.prototype.like = function () {
    this.click({ action: "like", selectorButton: this.selectors.like, selectorFrame: this.selectors.iframe });
  };

  BaseController.prototype.dislike = function () {
    this.click({ action: "dislike", selectorButton: this.selectors.dislike, selectorFrame: this.selectors.iframe });
  };

  /**
   * Attempts to check if the site is playing anything
   * @return {Boolean} true if site is currently playing
   */
  BaseController.prototype.isPlaying = function () {

    if (this.selectors.play === null && this.canGetMedia) {
      var media = this.getMedia();
      if (media) {
        return !media.paused;
      }
      return false;
    } else {
      var playEl = this.doc().querySelector(this.selectors.play),
        isPlaying = false;
      if (this.buttonSwitch) {
        // If playEl does not exist then it is currently playing
        isPlaying = (playEl === null);
      }
      else if (this.selectors.playState) {
        // Check if the play state element exists and is visible
        var playStateEl = this.doc().querySelector(this.selectors.playState);
        isPlaying = !!(playStateEl && (window.getComputedStyle(playStateEl, null).getPropertyValue("display") !== "none"));
      }
      else if (playEl) {
        isPlaying = (window.getComputedStyle(playEl, null).getPropertyValue("display") === "none");
      }
      return isPlaying;
    }

  };

  BaseController.prototype.setPosition = function (time) {
    if (this.canGetMedia) {
      var media = this.getMedia();
      if (media != undefined) {
        media.currentTime = time;
      }
    }
  };

  BaseController.prototype.seek = function (time) {
    // default implementation uses selectors if present
    if (this.canGetMedia) {
      var media = this.getMedia();
      if (media != undefined) {
        media.currentTime += time;
      }
    }
  };

  BaseController.prototype.getCurrentTime = function () {
    // default implementation uses selectors if present
    if (this.selectors.currentTime) {
      var timestr = (this.getSongData(this.selectors.currentTime) || "0").trim();
      return this.hmsToSecondsOnly(timestr) * 1000 * 1000;
    } else if (this.canGetMedia) {
      var media = this.getMedia();
      if (media != undefined) {
        return media.currentTime * 1000 * 1000;
      }
    }
    return null;
  };

  BaseController.prototype.getTotalTime = function () {
    // default implementation uses selectors if present
    if (this.selectors.totalTime) {
      var timestr = (this.getSongData(this.selectors.totalTime) || "0").trim();
      return this.hmsToSecondsOnly(timestr) * 1000 * 1000;
    } else if (this.canGetMedia) {
      var media = this.getMedia();
      if (media != undefined) {
        return media.duration * 1000 * 1000;
      }
    }
    return null;
  };

  BaseController.prototype.isMuted = function () {
    if (this.canGetMedia) {
      var media = this.getMedia();
      if (media != undefined) {
        return media.muted;
      }
    }
    return null;
  };

  BaseController.prototype.getVolume = function () {
    // default implementation uses selectors if present
    if (this.canGetMedia) {
      var media = this.getMedia();
      if (media != undefined && !media.muted) {
        this.volume = media.volume;
        return media.volume;
      } else {
        // last saved volume
        return this.volume;
      }
    }
    return null;
  };

  BaseController.prototype.setVolume = function (volume) {
    // default implementation uses selectors if present
    if (this.canGetMedia) {
      var media = this.getMedia();
      if (media != undefined) {
        media.volume = volume;
      }
    }
  };

  /**
   * Gets the current state of the music player and passes data to background page (and eventually popup)
   */
  BaseController.prototype.updatePlayerState = function () {
    if (this.checkPlayer) this.checkPlayer();

    var newState = this.getStateData();
    if (JSON.stringify(newState) !== JSON.stringify(this.oldState)) {
      sk_log("Player state change");
      if (this.getSongChanged(newState)) {
        chrome.runtime.sendMessage({
          action: "send_change_notification",
          stateData: newState
        });
      }
      this.oldState = newState;
      chrome.runtime.sendMessage({
        action: "update_player_state",
        stateData: newState
      });
    }
  };

  /**
   * Gets an object containing the current player state data
   * @return {{song: {String}, artist: {String}, isPlaying: {Boolean}, siteName: {String}}}
   */
  BaseController.prototype.getStateData = function () {
    var state = {
      song: (this.getSongData(this.selectors.song) === null ? null : this.getSongData(this.selectors.song).replace(/\s+/g, " ")),
      artist: (this.getSongData(this.selectors.artist) === null ? null : this.getSongData(this.selectors.artist).replace(/\s+/g, " ")),
      album: (this.getSongData(this.selectors.album) === null ? null : this.getSongData(this.selectors.album).replace(/\s+/g, " ")),
      art: this.getArtData(this.selectors.art),
      currentTime: this.getSongData(this.selectors.currentTime),
      totalTime: this.getSongData(this.selectors.totalTime),
      isPlaying: this.isPlaying(),
      siteName: (this.siteName == null ? null : this.siteName.replace(/\s+/g, " ")),
      canDislike: !!(this.selectors.dislike && this.doc().querySelector(this.selectors.dislike)),
      canPlayPrev: this.overridePlayPrev || !!(this.selectors.playPrev && this.doc().querySelector(this.selectors.playPrev)),
      canPlayPause: this.overridePlayPause || !!(
        (this.selectors.playPause && this.doc().querySelector(this.selectors.playPause)) ||
        (this.selectors.play && this.doc().querySelector(this.selectors.play)) ||
        (this.selectors.pause && this.doc().querySelector(this.selectors.pause))
      ),
      canPlayNext: this.overridePlayNext || !!(this.selectors.playNext && this.doc().querySelector(this.selectors.playNext)),
      canMute: this.canMute,
      canLike: !!(this.selectors.like && this.doc().querySelector(this.selectors.like)),
      canSeek: this.canSeek,
      canSetVolume: this.canSetVolume,
      hidePlayer: this.hidePlayer
    };
    state.volume = this.getVolume();
    return state;
  };

  /**
   * Returns a bool indicating whether the player's song changed since the last state update
   * @param {{song: {String}}} newState - new state object
   * @return {Boolean} true if song just changed, false otherwise
   */
  BaseController.prototype.getSongChanged = function (newState) {
    return this.oldState &&
      newState &&
      this.oldState.song !== newState.song;
  };

  /**
   * Gets the text value from a song data selector
   * @param {String} selector - selector for song data
   * @return {*} song data if element is found, null otherwise
   */
  BaseController.prototype.getSongData = function (selector) {
    if (!selector) return null;

    var dataEl = this.doc().querySelector(selector);
    if (dataEl && dataEl.textContent) {
      return dataEl.textContent;
    }

    return null;
  };

  BaseController.prototype.getArtData = function (selector) {
    if (!selector) return null;

    var dataEl = this.doc().querySelector(selector);
    if (dataEl && dataEl.attributes && dataEl.attributes.src) {
      return dataEl.attributes.src.value;
    }

    return null;
  };

  /**
   * Callback for request from background page
   */
  BaseController.prototype.doRequest = function (request, sender, response) {
    if (typeof request !== "undefined") {
      if (request.action === "playPause") this.playPause();
      if (request.action === "playNext") this.playNext();
      if (request.action === "playPrev") this.playPrev();
      if (request.action === "stop") this.stop();
      if (request.action === "mute") this.mute();
      if (request.action === "like") this.like();
      if (request.action === "dislike") this.dislike();
      if (request.action === "position") this.setPosition(request.args[0]);
      if (request.action === "seek") this.seek(request.args[0]);
      if (request.action === "forward5") this.seek(5); // manifest command
      if (request.action === "replay5") this.seek(-5); // manifest command
      if (request.action === "volume") {
        // mpris
        this.volume = Math.min(1.0, Math.max(0.0, request.args[0]));
        this.setVolume(this.volume);
      }
      if (request.action === "addVolume") {
        // from popup
        this.volume = Math.min(1.0, Math.max(0.0, this.volume + request.args[0]));
        this.setVolume(this.volume);
      }
      if (request.action === "volumeup") {
        // manifest command
        this.volume = Math.min(1.0, Math.max(0.0, this.volume + 0.05));
        this.setVolume(this.volume);
      }
      if (request.action === "volumedown") {
        // manifest command
        this.volume = Math.min(1.0, Math.max(0.0, this.volume - 0.05));
        this.setVolume(this.volume);
      }
      if (request.action === "playerStateNotify") {
        chrome.runtime.sendMessage({
          action: "send_change_notification",
          stateData: this.getStateData()
        });
      }
      if (request.action === "getPlayerState") {
        var newState = this.getStateData();
        this.oldState = newState;
        response(newState);
      }
    }
  };

  /**
   * Setup listeners for extension messages. Initialize the playerState interval
   */
  BaseController.prototype.attachListeners = function () {
    // Listener for requests from background page
    chrome.runtime.onMessage.addListener(this.doRequest.bind(this));

    // Update the popup player state intermittently
    setInterval(this.updatePlayerState.bind(this), 200);

    sk_log("Attached listener for ", this);
  };

  BaseController.prototype.hmsToSecondsOnly = function (str) {
    var p = str.split(":");
    var s = 0;
    var m = 1;

    while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
    }

    return s;
  };

  module.exports = BaseController;
})();
