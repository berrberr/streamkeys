;(function() {
  "use strict";

  var BaseController = function() { return this; };
  var sk_log = require("../modules/sk_log.js");

  BaseController.prototype.init = function(options) {
    this.name = document.location.hostname;

    //** Properties **//
    this.selector_playPause = options.playPause || null;
    this.selector_play = options.play || null;
    this.selector_pause = options.pause || null;
    this.selector_playNext = options.playNext || null;
    this.selector_playPrev = options.playPrev || null;
    this.selector_mute = options.mute || null;
    this.selector_iframe = options.iframe || null;

    //Optional. Style of play and pause buttons when they are NOT in use
    //EX: When a play button is in use, css class "playing" is added
    //In that case, set playStyle to "playing"
    this.playStyle = options.playStyle || null;
    this.pauseStyle = options.pauseStyle || null;

    //Set to true if the play/pause buttons share the same element
    this.buttonSwitch = options.buttonSwitch || false;

    //Default listener sends actions to main document
    this.attachListener();

    chrome.runtime.sendMessage({created: true}, function() {
      sk_log("Told BG we are created");
    });

    sk_log("SK content script loaded");

    document.addEventListener("streamkeys-test-loaded", function() {
      console.log("~~~~~~GOT LOAD EVENT REQUEST~~~~~");
      document.dispatchEvent(new CustomEvent("streamkeys-test-response", {detail: "loaded"}));
    });
  };

  BaseController.prototype.injectScript = function(file) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    if(file.url) {script.setAttribute("src", chrome.extension.getURL(file.url));}
    if(file.script) {script.innerHTML = file.script;}
    (document.head||document.documentElement).appendChild(script);
  };

  BaseController.prototype.isPlaying = function() {
    var playEl = document.querySelector(this.selector_play),
        displayStyle = "none",
        isPlaying = false;

    if(this.buttonSwitch) {
      //If playEl does not exist then it is currently playing
      isPlaying = (playEl === null);
    } else {
      //Check for play/pause style overrides
      if(this.playStyle && this.pauseStyle) {
        //Check if the class list contains the class that is only active when play button is playing
        isPlaying = playEl.classList.contains(this.playStyle);
      } else {
        //hack to get around sometimes not being able to read css properties that are not inline
        if (playEl.currentStyle) {
          displayStyle = playEl.currentStyle.display;
        } else if (window.getComputedStyle) {
          displayStyle = window.getComputedStyle(playEl, null).getPropertyValue("display");
        }
        isPlaying = (displayStyle == "none");
      }
    }

    sk_log("IsPlaying: " + isPlaying);
    return isPlaying;
  };

  //** Click inside document **//
  BaseController.prototype.click = function(opts) {
    opts = opts || {};
    if(opts.selectorButton === null) {
      sk_log("disabled", opts.action);
      document.dispatchEvent(new CustomEvent("streamkeys-test-response", {detail: "disabled"}));
      return;
    }

    var doc = (opts.selectorFrame) ? document.querySelector(opts.selectorFrame).contentWindow.document : document;
    if (!doc) return;

    try {
      doc.querySelector(opts.selectorButton).click();
      sk_log(opts.action);
      document.dispatchEvent(new CustomEvent("streamkeys-test-response", {detail: opts.action}));
    } catch(e) {
      sk_log("Element not found for click.", opts.selectorButton, true);
      document.dispatchEvent(new CustomEvent("streamkeys-test-response", {detail: "FAILURE: " + opts.action}));
    }
  };

  //TODO: make isPlaying work with iframes
  BaseController.prototype.playPause = function() {
    if(this.selector_play !== null && this.selector_pause !== null) {
      if(this.isPlaying()) {
        this.click({action: "playPause", selectorButton: this.selector_pause, selectorFrame: this.selector_iframe});
      } else {
        this.click({action: "playPause", selectorButton: this.selector_play, selectorFrame: this.selector_iframe});
      }
    } else {
      this.click({action: "playPause", selectorButton: this.selector_playPause, selectorFrame: this.selector_iframe});
    }
  };

  BaseController.prototype.playNext = function() {
    this.click({action: "playNext", selectorButton: this.selector_playNext, selectorFrame: this.selector_iframe});
  };

  BaseController.prototype.playPrev = function() {
    this.click({action: "playPrev", selectorButton: this.selector_playPrev, selectorFrame: this.selector_iframe});
  };

  BaseController.prototype.mute = function() {
    this.click({action: "mute", selectorButton: this.selector_mute, selectorFrame: this.selector_iframe});
  };

  BaseController.prototype.doRequest = function(request) {
    if(typeof request !== "undefined") {
      if(request.action == "playPause") this.playPause();
      if(request.action == "playNext") this.playNext();
      if(request.action == "playPrev") this.playPrev();
      if(request.action == "mute") this.mute();
    }
  };

  BaseController.prototype.doTestRequest = function(e) {
    if(e.detail && (e.detail == "playPause" || e.detail == "playNext" || e.detail == "playPrev" || e.detail == "mute")) {
      this.doRequest({action: e.detail});
    }
  };

  BaseController.prototype.attachListener = function() {
    chrome.runtime.onMessage.addListener(this.doRequest.bind(this));

    //Test event handler to simulate command presses
    document.addEventListener("streamkeys-test", this.doTestRequest.bind(this));

    sk_log("Attached listener for ", this);
  };

  var singleton = new BaseController();
  module.exports = singleton;
})();
