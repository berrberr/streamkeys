(function() {
  "use strict";

  require("../modules/utils.js");
  var sk_log = require("../modules/SKLog.js");

  function BaseController(options) {
    this.siteName = options.siteName || null;

    this.selectors = {};
    var selectorsKeys = [
      'playPause', 'play', 'pause',
      'playNext', 'playPrev', 'isPlaying',
      'mute', 'like', 'dislike', 'iframe',
      //** Song Info **//
      'song', 'artist'
    ];
    selectorsKeys.forEach((key) => this.selectors[key] = null);

    // Assign passed options to this and this.selectors
    Object.keys(options).forEach((key) => {
      if (!selectorsKeys.isInclude(key)) {
        this[key] = options[key];
      } else {
        if (typeof options[key] == "function")
          this[key] = options[key];
        else if (options[key])
          this.selectors[key] = options[key];
      }
    });

    // deprecated: selectors.playState, new name: isPlaying
    // backward compatibility:
    if (!this.selectors.isPlaying)
      this.selectors.isPlaying = options.playState || null;


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

    chrome.runtime.sendMessage({ created: true }, function() {
      sk_log("SK content script loaded");
    });

    this.getElement = (selector) => {
      return this.doc().querySelector(selector);
    };

    this.getElements = (selector) => {
      return this.doc().querySelectorAll(selector);
    };

    this.isVisible = (element) => {
      return window.getComputedStyle(element, null)
        .getPropertyValue("display") != "none";
    };

  }

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
    if(this.play && this.pause) {

      if(this.isPlaying())
        this.pause();
      else
        this.play();

    } else if(this.selectors.play !== null && this.selectors.pause !== null) {

      if(this.isPlaying())
        this.click({action: "playPause", selectorButton: this.selectors.pause, selectorFrame: this.selectors.iframe});
      else
        this.click({action: "playPause", selectorButton: this.selectors.play, selectorFrame: this.selectors.iframe});

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
        isPlaying = false;

    if(this.buttonSwitch) {
      // If playEl does not exist then it is currently playing
      isPlaying = (playEl === null);
    }
    else if(this.selectors.isPlaying) {
      // Check if the play state element exists and is visible
      var playStateEl = this.doc().querySelector(this.selectors.isPlaying);
      isPlaying = !!(playStateEl && this.isVisible(playStateEl));
    }
    else if(playEl) {
      isPlaying = this.isVisible(playEl);
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
      canPlayPrev: this.overridePlayPrev || !!(this.selectors.playPrev && this.doc().querySelector(this.selectors.playPrev)),
      canPlayPause: this.overridePlayPause || !!(
        (this.selectors.playPause && this.doc().querySelector(this.selectors.playPause)) ||
        (this.selectors.play && this.doc().querySelector(this.selectors.play)) ||
        (this.selectors.pause && this.doc().querySelector(this.selectors.pause))
      ),
      canPlayNext: this.overridePlayNext || !!(this.selectors.playNext && this.doc().querySelector(this.selectors.playNext)),
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
   * Setup listeners for extension messages. Initialize the playerState interval
   */
  BaseController.prototype.attachListeners = function() {
    // Listener for requests from background page
    chrome.runtime.onMessage.addListener(this.doRequest.bind(this));

    // Update the popup player state intermittently
    setInterval(this.updatePlayerState.bind(this), 200);

    sk_log("Attached listener for ", this);
  };

  module.exports = BaseController;
})();
