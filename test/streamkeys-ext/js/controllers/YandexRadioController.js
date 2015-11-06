(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Yandex Radio",
    playPause: ".player-controls__play",
    playNext: ".slider__item:nth-child(4) .button.skip",
    mute: ".volume__btn",
    like: ".like_action_like",
    dislike: ".like_action_dislike",

    song: ".slider__item:nth-child(3) .track__title",
    artist: ".slider__item:nth-child(3) .track__artists"
  });
})();

},{"BaseController":2}],2:[function(require,module,exports){
;(function() {
  "use strict";

  var BaseController = function() { return this; };
  var sk_log = require("../modules/SKLog.js");

  BaseController.prototype.init = function(options) {
    this.name = document.location.hostname;
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

      //** States **//
      playState: (options.playState || null),
      pauseState: (options.pauseState || null),

      // ** Song Change Observer **//
      songChange: (options.songChange || null),

      //** Song Info **//
      song: (options.song || null),
      artist: (options.artist || null)
    };

    // Optional. Style of play and pause buttons when they are NOT in use
    // EX: When a play button is in use, css class "playing" is added
    // In that case, set playStyle to "playing"
    this.playStyle = options.playStyle || null;
    this.pauseStyle = options.pauseStyle || null;

    // Previous player state, used to check vs current player state to see if anything changed
    this.oldState = {};

    // Set to true if the play/pause buttons share the same element
    this.buttonSwitch = options.buttonSwitch || false;

    // Default listener sends actions to main document
    this.attachListeners();

    // Set to true if the tab should be hidden from the popup unless it has a playPause element shown
    this.hidePlayer = options.hidePlayer || false;

    chrome.runtime.sendMessage({created: true}, function() {
      sk_log("Told BG we are created");
    });

    sk_log("SK content script loaded");

    document.addEventListener("streamkeys-test-loaded", function() {
      sk_log("loaded");
    });
  };

  BaseController.prototype.doc = function() {
    var useFrameSelector = (this.selectors.iframe && document.querySelector(this.selectors.iframe).tagName === "IFRAME");
    return (useFrameSelector) ? document.querySelector(this.selectors.iframe).contentWindow.document : document;
  };

  /**
   * Inject a script into the current document
   * @param {String} file.url - /relative/path/to/script
   * @param {String} file.script - plaintext script as a string
   */
  BaseController.prototype.injectScript = function(file) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    if(file.url) {script.setAttribute("src", chrome.extension.getURL(file.url));}
    if(file.script) {script.innerHTML = file.script;}
    (document.head || document.documentElement).appendChild(script);
  };

  /**
   * Click inside document
   * @param {String} opts.selectorButton - css selector for button to click
   * @param {String} opts.action - name of action to log to console for debugging purposes
   * @param {String} [opts.selectorFrame] - css selector for iframe to send clicks to
   */
  BaseController.prototype.click = function(opts) {
    opts = opts || {};
    if(opts.selectorButton === null) {
      sk_log("disabled", opts.action);
      return;
    }

    try {
      this.doc().querySelector(opts.selectorButton).click();
      sk_log(opts.action);
    } catch(e) {
      sk_log("Element not found for click.", opts.selectorButton, true);
    }

    // Update the player state after a click
    this.updatePlayerState();
  };

  BaseController.prototype.playPause = function() {
    if(this.selectors.play !== null && this.selectors.pause !== null) {
      if(this.isPlaying()) {
        this.click({action: "playPause", selectorButton: this.selectors.pause, selectorFrame: this.selectors.iframe});
      } else {
        this.click({action: "playPause", selectorButton: this.selectors.play, selectorFrame: this.selectors.iframe});
      }
    } else {
      this.click({action: "playPause", selectorButton: this.selectors.playPause, selectorFrame: this.selectors.iframe});
    }
  };

  BaseController.prototype.playNext = function() {
    this.click({action: "playNext", selectorButton: this.selectors.playNext, selectorFrame: this.selectors.iframe});
  };

  BaseController.prototype.playPrev = function() {
    this.click({action: "playPrev", selectorButton: this.selectors.playPrev, selectorFrame: this.selectors.iframe});
  };

  BaseController.prototype.stop = function() {
    if(this.isPlaying()) this.playPause();
  };

  BaseController.prototype.mute = function() {
    this.click({action: "mute", selectorButton: this.selectors.mute, selectorFrame: this.selectors.iframe});
  };

  BaseController.prototype.like = function() {
    this.click({action: "like", selectorButton: this.selectors.like, selectorFrame: this.selectors.iframe});
  };

  BaseController.prototype.dislike = function() {
    this.click({action: "dislike", selectorButton: this.selectors.dislike, selectorFrame: this.selectors.iframe});
  };

  /**
   * Attempts to check if the site is playing anything
   * @return {Boolean} true if site is currently playing
   */
  BaseController.prototype.isPlaying = function() {
    var playEl = this.doc().querySelector(this.selectors.play),
        playPauseEl = this.doc().querySelector(this.selectors.playPause),
        isPlaying = false;

    if(this.buttonSwitch) {
      // If playEl does not exist then it is currently playing
      isPlaying = (playEl === null);
    } else {
      // Check for play/pause style overrides
      if(this.playStyle) {
        // Check if the class list contains the class that is only active when play button is playing
        isPlaying = playPauseEl.classList.contains(this.playStyle);
      } else if(this.pauseStyle && this.selectors.pause) {
        var pauseEl = this.doc().querySelector(this.selectors.pause);
        isPlaying = pauseEl.classList.contains(this.pauseStyle);
      } else {
        // Check if the pause element exists
        if(this.selectors.playState) {
          var playStateEl = this.doc().querySelector(this.selectors.playState);
          isPlaying = (playStateEl && window.getComputedStyle(playStateEl, null).getPropertyValue("display") !== "none");
        }
        // Hack to get around sometimes not being able to read css properties that are not inline
        else if(playEl) {
          var displayStyle = "none";
          if (playEl.currentStyle) {
            displayStyle = playEl.currentStyle.display;
          } else if (window.getComputedStyle) {
            displayStyle = window.getComputedStyle(playEl, null).getPropertyValue("display");
          }
          isPlaying = (displayStyle == "none");
        } else {
          return null;
        }
      }
    }

    return isPlaying;
  };

  /**
   * Gets the current state of the music player and passes data to background page (and eventually popup)
   */
  BaseController.prototype.updatePlayerState = function() {
    if(this.checkPlayer) this.checkPlayer();

    var newState = this.getStateData();
    if(JSON.stringify(newState) !== JSON.stringify(this.oldState)) {
      sk_log("Player state change");
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
  BaseController.prototype.getStateData = function() {
    return {
      song: this.getSongData(this.selectors.song),
      artist: this.getSongData(this.selectors.artist),
      isPlaying: this.isPlaying(),
      siteName: this.siteName,
      canDislike: !!(this.selectors.dislike && this.doc().querySelector(this.selectors.dislike)),
      canPlayPrev: !!(this.selectors.playPrev && this.doc().querySelector(this.selectors.playPrev)),
      canPlayPause: this.overridePlayPause || !!(
        (this.selectors.playPause && this.doc().querySelector(this.selectors.playPause)) ||
        (this.selectors.play && this.doc().querySelector(this.selectors.play)) ||
        (this.selectors.pause && this.doc().querySelector(this.selectors.pause))
      ),
      canPlayNext: !!(this.selectors.playNext && this.doc().querySelector(this.selectors.playNext)),
      canLike: !!(this.selectors.like && this.doc().querySelector(this.selectors.like)),
      hidePlayer: this.hidePlayer
    };
  };

  /**
   * Gets the text value from a song data selector
   * @param {String} selector - selector for song data
   * @return {*} song data if element is found, null otherwise
   */
  BaseController.prototype.getSongData = function(selector) {
    if(!selector) return null;

    var dataEl = this.doc().querySelector(selector);
    if(dataEl && dataEl.textContent) {
      return dataEl.textContent;
    }

    return null;
  };

  /**
   * Checks if a BaseController property is set. Used for testing.
   * @param {String} property - name of property to check for
   */
  BaseController.prototype.getProperty = function(property) {
    if(this[property]) sk_log(property);
    else sk_log("Property not found.", property, true);
  };

  /**
   * Callback for request from background page
   */
  BaseController.prototype.doRequest = function(request, sender, response) {
    if(typeof request !== "undefined") {
      if(request.action === "playPause") this.playPause();
      if(request.action === "playNext") this.playNext();
      if(request.action === "playPrev") this.playPrev();
      if(request.action === "stop") this.stop();
      if(request.action === "mute") this.mute();
      if(request.action === "like") this.like();
      if(request.action === "dislike") this.dislike();
      if(request.action === "getPlayerState") {
        var newState = this.getStateData();
        this.oldState = newState;
        response(newState);
      }
    }
  };

  /**
   * Callback for request from tester
   */
  BaseController.prototype.doTestRequest = function(e) {
    if(e.detail) {

      if(e.detail === "playPause" || e.detail === "playNext" || e.detail === "playPrev" || e.detail === "stop" || e.detail === "mute" || e.detail === "like"|| e.detail === "dislike" ) {
        this.doRequest({action: e.detail});
      }

      if(e.detail == "songName") this.test_getSongData(this.selectors.song);
      if(e.detail == "artistName") this.test_getSongData(this.selectors.artist);
      if(e.detail == "siteName") this.getProperty("siteName");
      if(e.detail == "isPlaying") this.isPlaying();
    }
  };

  /**
   * Process a test request to get song data
   * @param {String} selector - query selector for song data text
   */
  BaseController.prototype.test_getSongData = function(selector) {
    var songData = this.getSongData(selector);
    if(songData) {
      sk_log("Song data: ", songData);
    } else {
      sk_log("Song data not found.", {}, true);
    }
  };

  /**
   * Setup listeners for extension messages and test requests. Initialize the playerState interval
   */
  BaseController.prototype.attachListeners = function() {
    // Listener for requests from background page
    chrome.runtime.onMessage.addListener(this.doRequest.bind(this));

    // Listener for requests from tests
    document.addEventListener("streamkeys-test", this.doTestRequest.bind(this));

    // Update the popup player state intermittently
    setInterval(this.updatePlayerState.bind(this), 200);

    sk_log("Attached listener for ", this);
  };

  module.exports = new BaseController();
})();

},{"../modules/SKLog.js":3}],3:[function(require,module,exports){
;(function() {
  "use strict";

  /**
   * Log messages to console with prepended message. Also dispatches a JS event
   * to interact with tests
   * @param msg {String} message to log
   * @param [obj] {Object} object to dump with message
   * @param [err] {Boolean} TRUE if the message is an error
   */
  module.exports = function(msg, obj, err) {
    if(msg) {
      obj = obj || "";
      if(err) {
        console.error("STREAMKEYS-ERROR: " + msg, obj);
        msg = "ERROR: " + msg;
      } else {
        console.log("STREAMKEYS-INFO: " + msg, obj);
      }

      document.dispatchEvent(new CustomEvent("streamkeys-test-response", {detail: msg}));
    }
  };
})();

},{}]},{},[1]);
