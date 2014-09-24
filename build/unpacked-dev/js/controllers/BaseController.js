(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BaseController = function() { return this; };
var sk_log = require("../modules/sk_log.js").sk_log;

BaseController.prototype.init = function(options) {
  this.name = document.location.hostname;

  //** Inject console log formatter **//
  //this.injectScript({script: sk_log});

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

  this.iframe = (typeof options.iframe === "string");

  //Set to true if the play/pause buttons share the same element
  this.buttonSwitch = options.buttonSwitch || false;

  //Default listener sends actions to main document
  if(this.iframe) {
    this.attachFrameListener();
  } else {
    this.attachListener();
  }

  chrome.runtime.sendMessage({created: true}, function(response){
    sk_log("Told BG we are created");
  });

  sk_log("SK content script loaded");
};

BaseController.prototype.injectScript = function(file) {
  var script = document.createElement("script");
  script.setAttribute('type', 'text/javascript');
  if(file.url) {script.setAttribute('src', chrome.extension.getURL(file.url));}
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
BaseController.prototype.click = function(selectorButton, action) {
  var ele = document.querySelector(selectorButton);

  try {
    ele.click();
    sk_log(action);
  } catch(e) {
    sk_log("Element not found for click.", selectorButton, true);
  }
};

//** Click inside an iframe **//
BaseController.prototype.clickInFrame = function(selectorFrame, selectorButton, action) {
  var doc = document.querySelector(selectorFrame).contentWindow.document;
  if (!doc) return null;

  try {
    doc.querySelector(selectorButton).click();
    sk_log(action);
  } catch(e) {
    sk_log("Element not found for click.", selectorButton, true);
  }
};

//TODO: make isPlaying work with iframes
BaseController.prototype.playPause = function() {
  if(this.selector_play !== null && this.selector_pause !== null) {
    if(this.isPlaying()) {
      this.click(this.selector_pause, "playPause");
    } else {
      this.click(this.selector_play, "playPause");
    }
  } else {
    if(this.iframe) this.clickInFrame(this.selector_iframe, this.selector_playPause, "playPause");
    else            this.click(this.selector_playPause, "playPause");
  }
};

BaseController.prototype.playNext = function() {
  if(this.selector_playNext) {
    if(this.iframe) this.clickInFrame(this.selector_iframe, this.selector_playNext, "playNext");
    else            this.click(this.selector_playNext, "playNext");
  }
};

BaseController.prototype.playPrev = function() {
  if(this.selector_playPrev) {
    if(this.iframe) this.clickInFrame(this.selector_iframe, this.selector_playPrev, "playPrev");
    else            this.click(this.selector_playPrev, "playPrev");
  }
};

BaseController.prototype.mute = function() {
  if(this.selector_mute) {
    if(this.iframe) this.clickInFrame(this.selector_iframe, this.selector_mute, "mute");
    else            this.click(this.selector_mute, "mute");
  }
};

BaseController.prototype.doRequest = function(request, sender, sendResponse) {
  if(typeof request !== "undefined") {
    if(request.action == "play_pause") this.playPause();
    if(request.action == "play_next") this.playNext();
    if(request.action == "play_prev") this.playPrev();
    if(request.action == "mute") this.mute();
  }
};

BaseController.prototype.attachListener = function() {
  chrome.runtime.onMessage.addListener(this.doRequest.bind(this));
  sk_log("Attached listener for ", this);
};

BaseController.prototype.attachFrameListener = function() {
  chrome.runtime.onMessage.addListener(this.doRequest.bind(this));
  sk_log("Attached frame listener for ", this);
};


var singleton = new BaseController();
module.exports = {
  init: function(options) { singleton.init(options); }
}

},{"../modules/sk_log.js":2}],2:[function(require,module,exports){
module.exports = {
  sk_log: function(msg, obj, err) {
    obj = obj || "";
    if(err) { console.error("STREAMKEYS-ERROR: " + msg, obj); }
    else { console.log("STREAMKEYS-INFO: " + msg, obj); }
  }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9jb250cm9sbGVycy9CYXNlQ29udHJvbGxlci5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9tb2R1bGVzL3NrX2xvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEJhc2VDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9O1xudmFyIHNrX2xvZyA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL3NrX2xvZy5qc1wiKS5za19sb2c7XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSBkb2N1bWVudC5sb2NhdGlvbi5ob3N0bmFtZTtcblxuICAvLyoqIEluamVjdCBjb25zb2xlIGxvZyBmb3JtYXR0ZXIgKiovL1xuICAvL3RoaXMuaW5qZWN0U2NyaXB0KHtzY3JpcHQ6IHNrX2xvZ30pO1xuXG4gIC8vKiogUHJvcGVydGllcyAqKi8vXG4gIHRoaXMuc2VsZWN0b3JfcGxheVBhdXNlID0gb3B0aW9ucy5wbGF5UGF1c2UgfHwgbnVsbDtcbiAgdGhpcy5zZWxlY3Rvcl9wbGF5ID0gb3B0aW9ucy5wbGF5IHx8IG51bGw7XG4gIHRoaXMuc2VsZWN0b3JfcGF1c2UgPSBvcHRpb25zLnBhdXNlIHx8IG51bGw7XG4gIHRoaXMuc2VsZWN0b3JfcGxheU5leHQgPSBvcHRpb25zLnBsYXlOZXh0IHx8IG51bGw7XG4gIHRoaXMuc2VsZWN0b3JfcGxheVByZXYgPSBvcHRpb25zLnBsYXlQcmV2IHx8IG51bGw7XG4gIHRoaXMuc2VsZWN0b3JfbXV0ZSA9IG9wdGlvbnMubXV0ZSB8fCBudWxsO1xuICB0aGlzLnNlbGVjdG9yX2lmcmFtZSA9IG9wdGlvbnMuaWZyYW1lIHx8IG51bGw7XG5cbiAgLy9PcHRpb25hbC4gU3R5bGUgb2YgcGxheSBhbmQgcGF1c2UgYnV0dG9ucyB3aGVuIHRoZXkgYXJlIE5PVCBpbiB1c2VcbiAgLy9FWDogV2hlbiBhIHBsYXkgYnV0dG9uIGlzIGluIHVzZSwgY3NzIGNsYXNzIFwicGxheWluZ1wiIGlzIGFkZGVkXG4gIC8vSW4gdGhhdCBjYXNlLCBzZXQgcGxheVN0eWxlIHRvIFwicGxheWluZ1wiXG4gIHRoaXMucGxheVN0eWxlID0gb3B0aW9ucy5wbGF5U3R5bGUgfHwgbnVsbDtcbiAgdGhpcy5wYXVzZVN0eWxlID0gb3B0aW9ucy5wYXVzZVN0eWxlIHx8IG51bGw7XG5cbiAgdGhpcy5pZnJhbWUgPSAodHlwZW9mIG9wdGlvbnMuaWZyYW1lID09PSBcInN0cmluZ1wiKTtcblxuICAvL1NldCB0byB0cnVlIGlmIHRoZSBwbGF5L3BhdXNlIGJ1dHRvbnMgc2hhcmUgdGhlIHNhbWUgZWxlbWVudFxuICB0aGlzLmJ1dHRvblN3aXRjaCA9IG9wdGlvbnMuYnV0dG9uU3dpdGNoIHx8IGZhbHNlO1xuXG4gIC8vRGVmYXVsdCBsaXN0ZW5lciBzZW5kcyBhY3Rpb25zIHRvIG1haW4gZG9jdW1lbnRcbiAgaWYodGhpcy5pZnJhbWUpIHtcbiAgICB0aGlzLmF0dGFjaEZyYW1lTGlzdGVuZXIoKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmF0dGFjaExpc3RlbmVyKCk7XG4gIH1cblxuICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7Y3JlYXRlZDogdHJ1ZX0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICBza19sb2coXCJUb2xkIEJHIHdlIGFyZSBjcmVhdGVkXCIpO1xuICB9KTtcblxuICBza19sb2coXCJTSyBjb250ZW50IHNjcmlwdCBsb2FkZWRcIik7XG59O1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUuaW5qZWN0U2NyaXB0ID0gZnVuY3Rpb24oZmlsZSkge1xuICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgaWYoZmlsZS51cmwpIHtzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChmaWxlLnVybCkpO31cbiAgaWYoZmlsZS5zY3JpcHQpIHtzY3JpcHQuaW5uZXJIVE1MID0gZmlsZS5zY3JpcHQ7fVxuICAoZG9jdW1lbnQuaGVhZHx8ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChzY3JpcHQpO1xufTtcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmlzUGxheWluZyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcGxheUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yX3BsYXkpLFxuICAgICAgZGlzcGxheVN0eWxlID0gXCJub25lXCIsXG4gICAgICBpc1BsYXlpbmcgPSBmYWxzZTtcblxuICBpZih0aGlzLmJ1dHRvblN3aXRjaCkge1xuICAgIC8vSWYgcGxheUVsIGRvZXMgbm90IGV4aXN0IHRoZW4gaXQgaXMgY3VycmVudGx5IHBsYXlpbmdcbiAgICBpc1BsYXlpbmcgPSAocGxheUVsID09PSBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICAvL0NoZWNrIGZvciBwbGF5L3BhdXNlIHN0eWxlIG92ZXJyaWRlc1xuICAgIGlmKHRoaXMucGxheVN0eWxlICYmIHRoaXMucGF1c2VTdHlsZSkge1xuICAgICAgLy9DaGVjayBpZiB0aGUgY2xhc3MgbGlzdCBjb250YWlucyB0aGUgY2xhc3MgdGhhdCBpcyBvbmx5IGFjdGl2ZSB3aGVuIHBsYXkgYnV0dG9uIGlzIHBsYXlpbmdcbiAgICAgIGlzUGxheWluZyA9IHBsYXlFbC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5wbGF5U3R5bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL2hhY2sgdG8gZ2V0IGFyb3VuZCBzb21ldGltZXMgbm90IGJlaW5nIGFibGUgdG8gcmVhZCBjc3MgcHJvcGVydGllcyB0aGF0IGFyZSBub3QgaW5saW5lXG4gICAgICBpZiAocGxheUVsLmN1cnJlbnRTdHlsZSkge1xuICAgICAgICBkaXNwbGF5U3R5bGUgPSBwbGF5RWwuY3VycmVudFN0eWxlLmRpc3BsYXk7XG4gICAgICB9IGVsc2UgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgIGRpc3BsYXlTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBsYXlFbCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImRpc3BsYXlcIik7XG4gICAgICB9XG4gICAgICBpc1BsYXlpbmcgPSAoZGlzcGxheVN0eWxlID09IFwibm9uZVwiKTtcbiAgICB9XG4gIH1cblxuICBza19sb2coXCJJc1BsYXlpbmc6IFwiICsgaXNQbGF5aW5nKTtcbiAgcmV0dXJuIGlzUGxheWluZztcbn07XG5cbi8vKiogQ2xpY2sgaW5zaWRlIGRvY3VtZW50ICoqLy9cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5jbGljayA9IGZ1bmN0aW9uKHNlbGVjdG9yQnV0dG9uLCBhY3Rpb24pIHtcbiAgdmFyIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JCdXR0b24pO1xuXG4gIHRyeSB7XG4gICAgZWxlLmNsaWNrKCk7XG4gICAgc2tfbG9nKGFjdGlvbik7XG4gIH0gY2F0Y2goZSkge1xuICAgIHNrX2xvZyhcIkVsZW1lbnQgbm90IGZvdW5kIGZvciBjbGljay5cIiwgc2VsZWN0b3JCdXR0b24sIHRydWUpO1xuICB9XG59O1xuXG4vLyoqIENsaWNrIGluc2lkZSBhbiBpZnJhbWUgKiovL1xuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmNsaWNrSW5GcmFtZSA9IGZ1bmN0aW9uKHNlbGVjdG9yRnJhbWUsIHNlbGVjdG9yQnV0dG9uLCBhY3Rpb24pIHtcbiAgdmFyIGRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JGcmFtZSkuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWYgKCFkb2MpIHJldHVybiBudWxsO1xuXG4gIHRyeSB7XG4gICAgZG9jLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JCdXR0b24pLmNsaWNrKCk7XG4gICAgc2tfbG9nKGFjdGlvbik7XG4gIH0gY2F0Y2goZSkge1xuICAgIHNrX2xvZyhcIkVsZW1lbnQgbm90IGZvdW5kIGZvciBjbGljay5cIiwgc2VsZWN0b3JCdXR0b24sIHRydWUpO1xuICB9XG59O1xuXG4vL1RPRE86IG1ha2UgaXNQbGF5aW5nIHdvcmsgd2l0aCBpZnJhbWVzXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUucGxheVBhdXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmKHRoaXMuc2VsZWN0b3JfcGxheSAhPT0gbnVsbCAmJiB0aGlzLnNlbGVjdG9yX3BhdXNlICE9PSBudWxsKSB7XG4gICAgaWYodGhpcy5pc1BsYXlpbmcoKSkge1xuICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BhdXNlLCBcInBsYXlQYXVzZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXksIFwicGxheVBhdXNlXCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZih0aGlzLmlmcmFtZSkgdGhpcy5jbGlja0luRnJhbWUodGhpcy5zZWxlY3Rvcl9pZnJhbWUsIHRoaXMuc2VsZWN0b3JfcGxheVBhdXNlLCBcInBsYXlQYXVzZVwiKTtcbiAgICBlbHNlICAgICAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXlQYXVzZSwgXCJwbGF5UGF1c2VcIik7XG4gIH1cbn07XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5TmV4dCA9IGZ1bmN0aW9uKCkge1xuICBpZih0aGlzLnNlbGVjdG9yX3BsYXlOZXh0KSB7XG4gICAgaWYodGhpcy5pZnJhbWUpIHRoaXMuY2xpY2tJbkZyYW1lKHRoaXMuc2VsZWN0b3JfaWZyYW1lLCB0aGlzLnNlbGVjdG9yX3BsYXlOZXh0LCBcInBsYXlOZXh0XCIpO1xuICAgIGVsc2UgICAgICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheU5leHQsIFwicGxheU5leHRcIik7XG4gIH1cbn07XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5UHJldiA9IGZ1bmN0aW9uKCkge1xuICBpZih0aGlzLnNlbGVjdG9yX3BsYXlQcmV2KSB7XG4gICAgaWYodGhpcy5pZnJhbWUpIHRoaXMuY2xpY2tJbkZyYW1lKHRoaXMuc2VsZWN0b3JfaWZyYW1lLCB0aGlzLnNlbGVjdG9yX3BsYXlQcmV2LCBcInBsYXlQcmV2XCIpO1xuICAgIGVsc2UgICAgICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheVByZXYsIFwicGxheVByZXZcIik7XG4gIH1cbn07XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5tdXRlID0gZnVuY3Rpb24oKSB7XG4gIGlmKHRoaXMuc2VsZWN0b3JfbXV0ZSkge1xuICAgIGlmKHRoaXMuaWZyYW1lKSB0aGlzLmNsaWNrSW5GcmFtZSh0aGlzLnNlbGVjdG9yX2lmcmFtZSwgdGhpcy5zZWxlY3Rvcl9tdXRlLCBcIm11dGVcIik7XG4gICAgZWxzZSAgICAgICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9tdXRlLCBcIm11dGVcIik7XG4gIH1cbn07XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5kb1JlcXVlc3QgPSBmdW5jdGlvbihyZXF1ZXN0LCBzZW5kZXIsIHNlbmRSZXNwb25zZSkge1xuICBpZih0eXBlb2YgcmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGlmKHJlcXVlc3QuYWN0aW9uID09IFwicGxheV9wYXVzZVwiKSB0aGlzLnBsYXlQYXVzZSgpO1xuICAgIGlmKHJlcXVlc3QuYWN0aW9uID09IFwicGxheV9uZXh0XCIpIHRoaXMucGxheU5leHQoKTtcbiAgICBpZihyZXF1ZXN0LmFjdGlvbiA9PSBcInBsYXlfcHJldlwiKSB0aGlzLnBsYXlQcmV2KCk7XG4gICAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJtdXRlXCIpIHRoaXMubXV0ZSgpO1xuICB9XG59O1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUuYXR0YWNoTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKHRoaXMuZG9SZXF1ZXN0LmJpbmQodGhpcykpO1xuICBza19sb2coXCJBdHRhY2hlZCBsaXN0ZW5lciBmb3IgXCIsIHRoaXMpO1xufTtcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmF0dGFjaEZyYW1lTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKHRoaXMuZG9SZXF1ZXN0LmJpbmQodGhpcykpO1xuICBza19sb2coXCJBdHRhY2hlZCBmcmFtZSBsaXN0ZW5lciBmb3IgXCIsIHRoaXMpO1xufTtcblxuXG52YXIgc2luZ2xldG9uID0gbmV3IEJhc2VDb250cm9sbGVyKCk7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucykgeyBzaW5nbGV0b24uaW5pdChvcHRpb25zKTsgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNrX2xvZzogZnVuY3Rpb24obXNnLCBvYmosIGVycikge1xuICAgIG9iaiA9IG9iaiB8fCBcIlwiO1xuICAgIGlmKGVycikgeyBjb25zb2xlLmVycm9yKFwiU1RSRUFNS0VZUy1FUlJPUjogXCIgKyBtc2csIG9iaik7IH1cbiAgICBlbHNlIHsgY29uc29sZS5sb2coXCJTVFJFQU1LRVlTLUlORk86IFwiICsgbXNnLCBvYmopOyB9XG4gIH1cbn07XG4iXX0=
