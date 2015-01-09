;(function() {
  "use strict";

  var BaseController = function() { return this; };
  var sk_log = require("../modules/SKLog.js");

  BaseController.prototype.init = function(options) {
    this.name = document.location.hostname;

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

    // Set to true if the play/pause buttons share the same element
    this.buttonSwitch = options.buttonSwitch || false;

    // Observers for song and title changes will be set in this obj
    this.observers = {};

    // Default listener sends actions to main document
    this.attachListeners();

    chrome.runtime.sendMessage({created: true}, function() {
      sk_log("Told BG we are created");
    });

    sk_log("SK content script loaded");

    document.addEventListener("streamkeys-test-loaded", function() {
      sk_log("loaded");
    });
  };

  /**
   * Inject a script into the current document
   * @param file.url [str] /relative/path/to/script
   * @param file.script [str] plaintext script as a string
   */
  BaseController.prototype.injectScript = function(file) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    if(file.url) {script.setAttribute("src", chrome.extension.getURL(file.url));}
    if(file.script) {script.innerHTML = file.script;}
    (document.head || document.documentElement).appendChild(script);
  };

  BaseController.prototype.isPlaying = function() {
    var playEl = document.querySelector(this.selectors.play),
        displayStyle = "none",
        isPlaying = false;

    if(this.buttonSwitch) {
      // If playEl does not exist then it is currently playing
      isPlaying = (playEl === null);
    } else {
      // Check for play/pause style overrides
      if(this.playStyle && this.pauseStyle) {
        // Check if the class list contains the class that is only active when play button is playing
        isPlaying = playEl.classList.contains(this.playStyle);
      } else {
        // Hack to get around sometimes not being able to read css properties that are not inline
        if(playEl) {
          if (playEl.currentStyle) {
            displayStyle = playEl.currentStyle.display;
          } else if (window.getComputedStyle) {
            displayStyle = window.getComputedStyle(playEl, null).getPropertyValue("display");
          }
          isPlaying = (displayStyle == "none");
        }
      }
    }

    sk_log("IsPlaying: " + isPlaying);
    return isPlaying;
  };

  /**
   * Click inside document
   * @param opts.selectorButton [str] css selector for button to click
   * @param opts.action [str] name of action to log to console for debugging purposes
   * @param opts.selectorFrame [str] OPTIONAL css selector for iframe to send clicks to
   */
  BaseController.prototype.click = function(opts) {
    opts = opts || {};
    if(opts.selectorButton === null) {
      sk_log("disabled", opts.action);
      return;
    }

    var doc = (opts.selectorFrame) ? document.querySelector(opts.selectorFrame).contentWindow.document : document;
    if (!doc) return;

    try {
      doc.querySelector(opts.selectorButton).click();
      sk_log(opts.action);
    } catch(e) {
      sk_log("Element not found for click.", opts.selectorButton, true);
    }
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
   * Gets the current state of the music player and passes data to background page (and eventually popup)
   */
  BaseController.prototype.getPlayerState = function() {
    chrome.runtime.sendMessage({
      action: "update_player_state",
      stateData: {
        song: this.getSongData(this.selectors.song),
        artist: this.getSongData(this.selectors.artist),
        isPlaying: this.isPlaying()
      }
    });
  };

  BaseController.prototype.getSongData = function(selector) {
    if(!selector) {
      sk_log("Missing selector");
      return null;
    }

    // If a call to get song data is made and we are not listening for song changes then attach a listener
    if(!this.observers.songChange) this.attachSongListeners();

    var dataEl = document.querySelector(selector);
    if(dataEl && dataEl.textContent) {
      sk_log("Song data found: ", dataEl.textContent);
      return dataEl.textContent;
    }

    sk_log("Song element not found", dataEl, true);
    return null;
  };

  BaseController.prototype.doRequest = function(request) {
    if(typeof request !== "undefined") {
      if(request.action === "playPause") this.playPause();
      if(request.action === "playNext") this.playNext();
      if(request.action === "playPrev") this.playPrev();
      if(request.action === "mute") this.mute();
      if(request.action === "like") this.like();
      if(request.action === "dislike") this.dislike();
      if(request.action === "getPlayerState") this.getPlayerState();
    }
  };

  BaseController.prototype.doTestRequest = function(e) {
    if(e.detail && (e.detail == "playPause" || e.detail == "playNext" || e.detail == "playPrev" || e.detail == "mute"|| e.detail == "like"|| e.detail == "dislike")) {
      this.doRequest({action: e.detail});
    }
  };

  BaseController.prototype.attachListeners = function() {
    chrome.runtime.onMessage.addListener(this.doRequest.bind(this));

    // Test event handler to simulate command presses
    document.addEventListener("streamkeys-test", this.doTestRequest.bind(this));

    sk_log("Attached listener for ", this);
    this.attachSongListeners();
  };

  BaseController.prototype.attachSongListeners = function(_attempts) {
    sk_log("Attempting to attach song listener...");
    var attempts = _attempts || 0;
    if(this.observers.songChange || attempts > 10) return;

    /**
     * On a change of the song element call getPlayerState which will send the updated song data to the background page
     */
    var mutationCallback = function() {
      this.getPlayerState();
    };

    if(this.selectors.songChange) {
      var songChangeEl = document.querySelector(this.selectors.songChange);

      if(songChangeEl) {
        this.observers.songChange = new MutationObserver(mutationCallback.bind(this));

        this.observers.songChange.observe(songChangeEl, { characterData: true, childList: true, attributes: true, subtree: true });
        sk_log("observer: ", this.observers.songChange);
        sk_log("element: ", songChangeEl);
        sk_log("obs setup");
      } else {
        window.setTimeout(this.attachSongListeners, 5000, attempts + 1);
      }
    }
  };

  module.exports = new BaseController();
})();
