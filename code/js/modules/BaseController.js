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

    // Set to true if the play/pause buttons share the same element
    this.buttonSwitch = options.buttonSwitch || false;

    // Observers for song and title changes will be set in this obj
    this.observers = {};

    // Enable debug console log messages
    this.debug = false;

    // Default listener sends actions to main document
    this.attachListeners();

    chrome.runtime.sendMessage({created: true}, function() {
      this.log("Told BG we are created");
    });

    this.log("SK content script loaded");

    document.addEventListener("streamkeys-test-loaded", function() {
      this.log("loaded");
    });
  };

  /**
   * Inject a script into the current document
   * @param file.url {String} /relative/path/to/script
   * @param file.script {String} plaintext script as a string
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
   * @param opts.selectorButton {String} css selector for button to click
   * @param opts.action {String} name of action to log to console for debugging purposes
   * @param opts.selectorFrame {String} OPTIONAL css selector for iframe to send clicks to
   */
  BaseController.prototype.click = function(opts) {
    opts = opts || {};
    if(opts.selectorButton === null) {
      this.log("disabled", opts.action);
      return;
    }

    var doc = (opts.selectorFrame) ? document.querySelector(opts.selectorFrame).contentWindow.document : document;
    if (!doc) return;

    try {
      doc.querySelector(opts.selectorButton).click();
      this.log(opts.action);
    } catch(e) {
      this.log("Element not found for click.", opts.selectorButton, true);
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
   * @returns {Boolean} true if site is currently playing
   */
  BaseController.prototype.isPlaying = function() {
    var playEl = document.querySelector(this.selectors.play),
        playPauseEl = document.querySelector(this.selectors.playPause),
        isPlaying = false;

    if(this.buttonSwitch) {
      // If playEl does not exist then it is currently playing
      isPlaying = (playEl === null);
    }
    else {
      // Check for play/pause style overrides
      if(this.playStyle) {
        // Check if the class list contains the class that is only active when play button is playing
        isPlaying = playPauseEl.classList.contains(this.playStyle);
      }
      else {
        // Check if the pause element exists
        if(this.selectors.pauseState && this.selectors.playState) {
          isPlaying = ((document.querySelector(this.selectors.pauseState) === null) &&
          (document.querySelector(this.selectors.playState) !== null));
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
        }
      }
    }

    this.log("IsPlaying: " + isPlaying);
    return isPlaying;
  };
  /**
   * Gets the current state of the music player and passes data to background page (and eventually popup)
   */
  BaseController.prototype.updatePlayerState = function() {
    chrome.runtime.sendMessage({
      action: "update_player_state",
      stateData: this.getStateData()
    });
  };

  /**
   * Gets an object containing the current player state data
   * @returns {{song: {String}, artist: {String}, isPlaying: {Boolean}, siteName: {String}}}
   */
  BaseController.prototype.getStateData = function() {
    return {
      song: this.getSongData(this.selectors.song),
      artist: this.getSongData(this.selectors.artist),
      isPlaying: this.isPlaying(),
      siteName: this.siteName
    };
  };

  BaseController.prototype.getSongData = function(selector) {
    if(!selector) {
      this.log("Missing selector");
      return null;
    }

    // If a call to get song data is made and we are not listening for song changes then attach a listener
    if(!this.observers.songChange) this.attachSongListeners();

    var dataEl = document.querySelector(selector);
    if(dataEl && dataEl.textContent) {
      this.log("Song data found: ", dataEl.textContent);
      return dataEl.textContent;
    }

    this.log("Song element not found", dataEl, true);
    return null;
  };

  BaseController.prototype.doRequest = function(request, sender, response) {
    if(typeof request !== "undefined") {
      if(request.action === "playPause") this.playPause();
      if(request.action === "playNext") this.playNext();
      if(request.action === "playPrev") this.playPrev();
      if(request.action === "mute") this.mute();
      if(request.action === "like") this.like();
      if(request.action === "dislike") this.dislike();
      if(request.action === "getPlayerState") {
        response(this.getStateData());
      }
    }
  };

  BaseController.prototype.doTestRequest = function(e) {
    if(e.detail && (e.detail == "playPause" || e.detail == "playNext" || e.detail == "playPrev" || e.detail == "mute"|| e.detail == "like"|| e.detail == "dislike")) {
      this.debug = true;
      this.doRequest({action: e.detail});
    }
  };

  BaseController.prototype.attachListeners = function() {
    chrome.runtime.onMessage.addListener(this.doRequest.bind(this));

    // Test event handler to simulate command presses
    document.addEventListener("streamkeys-test", this.doTestRequest.bind(this));

    this.log("Attached listener for ", this);
    this.attachSongListeners();

    // Update the popup player state intermittently
    setInterval(this.updatePlayerState.bind(this), 500);
  };

  BaseController.prototype.attachSongListeners = function(_attempts) {
    this.log("Attempting to attach song listener...");
    var attempts = _attempts || 0;
    if(this.observers.songChange || attempts > 10) return;

    /**
     * On a change of the song element call updatePlayerState which will send the updated song data to the background page
     */
    var mutationCallback = function() {
      this.updatePlayerState();
    };

    if(this.selectors.songChange) {
      var songChangeEl = document.querySelector(this.selectors.songChange);

      if(songChangeEl) {
        this.observers.songChange = new MutationObserver(mutationCallback.bind(this));

        this.observers.songChange.observe(songChangeEl, { characterData: true, childList: true, attributes: true });
        this.log("observer: ", this.observers.songChange);
        this.log("element: ", songChangeEl);
        this.log("obs setup");
      } else {
        window.setTimeout(this.attachSongListeners, 5000, attempts + 1);
      }
    }
  };

  BaseController.prototype.log = function(msg, obj, err) {
    if(this.debug) {
      sk_log(msg, obj, err);
    }
  };

  module.exports = new BaseController();
})();
