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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9tb2R1bGVzL0Jhc2VDb250cm9sbGVyLmpzIiwiL1VzZXJzL2FsZXgvc3RyZWFta2V5cy9jb2RlL2pzL21vZHVsZXMvc2tfbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQmFzZUNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH07XG52YXIgc2tfbG9nID0gcmVxdWlyZShcIi4uL21vZHVsZXMvc2tfbG9nLmpzXCIpLnNrX2xvZztcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9IGRvY3VtZW50LmxvY2F0aW9uLmhvc3RuYW1lO1xuXG4gIC8vKiogSW5qZWN0IGNvbnNvbGUgbG9nIGZvcm1hdHRlciAqKi8vXG4gIC8vdGhpcy5pbmplY3RTY3JpcHQoe3NjcmlwdDogc2tfbG9nfSk7XG5cbiAgLy8qKiBQcm9wZXJ0aWVzICoqLy9cbiAgdGhpcy5zZWxlY3Rvcl9wbGF5UGF1c2UgPSBvcHRpb25zLnBsYXlQYXVzZSB8fCBudWxsO1xuICB0aGlzLnNlbGVjdG9yX3BsYXkgPSBvcHRpb25zLnBsYXkgfHwgbnVsbDtcbiAgdGhpcy5zZWxlY3Rvcl9wYXVzZSA9IG9wdGlvbnMucGF1c2UgfHwgbnVsbDtcbiAgdGhpcy5zZWxlY3Rvcl9wbGF5TmV4dCA9IG9wdGlvbnMucGxheU5leHQgfHwgbnVsbDtcbiAgdGhpcy5zZWxlY3Rvcl9wbGF5UHJldiA9IG9wdGlvbnMucGxheVByZXYgfHwgbnVsbDtcbiAgdGhpcy5zZWxlY3Rvcl9tdXRlID0gb3B0aW9ucy5tdXRlIHx8IG51bGw7XG4gIHRoaXMuc2VsZWN0b3JfaWZyYW1lID0gb3B0aW9ucy5pZnJhbWUgfHwgbnVsbDtcblxuICAvL09wdGlvbmFsLiBTdHlsZSBvZiBwbGF5IGFuZCBwYXVzZSBidXR0b25zIHdoZW4gdGhleSBhcmUgTk9UIGluIHVzZVxuICAvL0VYOiBXaGVuIGEgcGxheSBidXR0b24gaXMgaW4gdXNlLCBjc3MgY2xhc3MgXCJwbGF5aW5nXCIgaXMgYWRkZWRcbiAgLy9JbiB0aGF0IGNhc2UsIHNldCBwbGF5U3R5bGUgdG8gXCJwbGF5aW5nXCJcbiAgdGhpcy5wbGF5U3R5bGUgPSBvcHRpb25zLnBsYXlTdHlsZSB8fCBudWxsO1xuICB0aGlzLnBhdXNlU3R5bGUgPSBvcHRpb25zLnBhdXNlU3R5bGUgfHwgbnVsbDtcblxuICB0aGlzLmlmcmFtZSA9ICh0eXBlb2Ygb3B0aW9ucy5pZnJhbWUgPT09IFwic3RyaW5nXCIpO1xuXG4gIC8vU2V0IHRvIHRydWUgaWYgdGhlIHBsYXkvcGF1c2UgYnV0dG9ucyBzaGFyZSB0aGUgc2FtZSBlbGVtZW50XG4gIHRoaXMuYnV0dG9uU3dpdGNoID0gb3B0aW9ucy5idXR0b25Td2l0Y2ggfHwgZmFsc2U7XG5cbiAgLy9EZWZhdWx0IGxpc3RlbmVyIHNlbmRzIGFjdGlvbnMgdG8gbWFpbiBkb2N1bWVudFxuICBpZih0aGlzLmlmcmFtZSkge1xuICAgIHRoaXMuYXR0YWNoRnJhbWVMaXN0ZW5lcigpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuYXR0YWNoTGlzdGVuZXIoKTtcbiAgfVxuXG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtjcmVhdGVkOiB0cnVlfSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgIHNrX2xvZyhcIlRvbGQgQkcgd2UgYXJlIGNyZWF0ZWRcIik7XG4gIH0pO1xuXG4gIHNrX2xvZyhcIlNLIGNvbnRlbnQgc2NyaXB0IGxvYWRlZFwiKTtcbn07XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5pbmplY3RTY3JpcHQgPSBmdW5jdGlvbihmaWxlKSB7XG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICBzY3JpcHQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvamF2YXNjcmlwdCcpO1xuICBpZihmaWxlLnVybCkge3NjcmlwdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIGNocm9tZS5leHRlbnNpb24uZ2V0VVJMKGZpbGUudXJsKSk7fVxuICBpZihmaWxlLnNjcmlwdCkge3NjcmlwdC5pbm5lckhUTUwgPSBmaWxlLnNjcmlwdDt9XG4gIChkb2N1bWVudC5oZWFkfHxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59O1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUuaXNQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3JfcGxheSksXG4gICAgICBkaXNwbGF5U3R5bGUgPSBcIm5vbmVcIixcbiAgICAgIGlzUGxheWluZyA9IGZhbHNlO1xuXG4gIGlmKHRoaXMuYnV0dG9uU3dpdGNoKSB7XG4gICAgLy9JZiBwbGF5RWwgZG9lcyBub3QgZXhpc3QgdGhlbiBpdCBpcyBjdXJyZW50bHkgcGxheWluZ1xuICAgIGlzUGxheWluZyA9IChwbGF5RWwgPT09IG51bGwpO1xuICB9IGVsc2Uge1xuICAgIC8vQ2hlY2sgZm9yIHBsYXkvcGF1c2Ugc3R5bGUgb3ZlcnJpZGVzXG4gICAgaWYodGhpcy5wbGF5U3R5bGUgJiYgdGhpcy5wYXVzZVN0eWxlKSB7XG4gICAgICAvL0NoZWNrIGlmIHRoZSBjbGFzcyBsaXN0IGNvbnRhaW5zIHRoZSBjbGFzcyB0aGF0IGlzIG9ubHkgYWN0aXZlIHdoZW4gcGxheSBidXR0b24gaXMgcGxheWluZ1xuICAgICAgaXNQbGF5aW5nID0gcGxheUVsLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnBsYXlTdHlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vaGFjayB0byBnZXQgYXJvdW5kIHNvbWV0aW1lcyBub3QgYmVpbmcgYWJsZSB0byByZWFkIGNzcyBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBpbmxpbmVcbiAgICAgIGlmIChwbGF5RWwuY3VycmVudFN0eWxlKSB7XG4gICAgICAgIGRpc3BsYXlTdHlsZSA9IHBsYXlFbC5jdXJyZW50U3R5bGUuZGlzcGxheTtcbiAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgZGlzcGxheVN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocGxheUVsLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZGlzcGxheVwiKTtcbiAgICAgIH1cbiAgICAgIGlzUGxheWluZyA9IChkaXNwbGF5U3R5bGUgPT0gXCJub25lXCIpO1xuICAgIH1cbiAgfVxuXG4gIHNrX2xvZyhcIklzUGxheWluZzogXCIgKyBpc1BsYXlpbmcpO1xuICByZXR1cm4gaXNQbGF5aW5nO1xufTtcblxuLy8qKiBDbGljayBpbnNpZGUgZG9jdW1lbnQgKiovL1xuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmNsaWNrID0gZnVuY3Rpb24oc2VsZWN0b3JCdXR0b24sIGFjdGlvbikge1xuICB2YXIgZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvckJ1dHRvbik7XG5cbiAgdHJ5IHtcbiAgICBlbGUuY2xpY2soKTtcbiAgICBza19sb2coYWN0aW9uKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgc2tfbG9nKFwiRWxlbWVudCBub3QgZm91bmQgZm9yIGNsaWNrLlwiLCBzZWxlY3RvckJ1dHRvbiwgdHJ1ZSk7XG4gIH1cbn07XG5cbi8vKiogQ2xpY2sgaW5zaWRlIGFuIGlmcmFtZSAqKi8vXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xpY2tJbkZyYW1lID0gZnVuY3Rpb24oc2VsZWN0b3JGcmFtZSwgc2VsZWN0b3JCdXR0b24sIGFjdGlvbikge1xuICB2YXIgZG9jID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvckZyYW1lKS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZiAoIWRvYykgcmV0dXJuIG51bGw7XG5cbiAgdHJ5IHtcbiAgICBkb2MucXVlcnlTZWxlY3RvcihzZWxlY3RvckJ1dHRvbikuY2xpY2soKTtcbiAgICBza19sb2coYWN0aW9uKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgc2tfbG9nKFwiRWxlbWVudCBub3QgZm91bmQgZm9yIGNsaWNrLlwiLCBzZWxlY3RvckJ1dHRvbiwgdHJ1ZSk7XG4gIH1cbn07XG5cbi8vVE9ETzogbWFrZSBpc1BsYXlpbmcgd29yayB3aXRoIGlmcmFtZXNcbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5UGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgaWYodGhpcy5zZWxlY3Rvcl9wbGF5ICE9PSBudWxsICYmIHRoaXMuc2VsZWN0b3JfcGF1c2UgIT09IG51bGwpIHtcbiAgICBpZih0aGlzLmlzUGxheWluZygpKSB7XG4gICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGF1c2UsIFwicGxheVBhdXNlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheSwgXCJwbGF5UGF1c2VcIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmKHRoaXMuaWZyYW1lKSB0aGlzLmNsaWNrSW5GcmFtZSh0aGlzLnNlbGVjdG9yX2lmcmFtZSwgdGhpcy5zZWxlY3Rvcl9wbGF5UGF1c2UsIFwicGxheVBhdXNlXCIpO1xuICAgIGVsc2UgICAgICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheVBhdXNlLCBcInBsYXlQYXVzZVwiKTtcbiAgfVxufTtcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXlOZXh0ID0gZnVuY3Rpb24oKSB7XG4gIGlmKHRoaXMuc2VsZWN0b3JfcGxheU5leHQpIHtcbiAgICBpZih0aGlzLmlmcmFtZSkgdGhpcy5jbGlja0luRnJhbWUodGhpcy5zZWxlY3Rvcl9pZnJhbWUsIHRoaXMuc2VsZWN0b3JfcGxheU5leHQsIFwicGxheU5leHRcIik7XG4gICAgZWxzZSAgICAgICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wbGF5TmV4dCwgXCJwbGF5TmV4dFwiKTtcbiAgfVxufTtcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXlQcmV2ID0gZnVuY3Rpb24oKSB7XG4gIGlmKHRoaXMuc2VsZWN0b3JfcGxheVByZXYpIHtcbiAgICBpZih0aGlzLmlmcmFtZSkgdGhpcy5jbGlja0luRnJhbWUodGhpcy5zZWxlY3Rvcl9pZnJhbWUsIHRoaXMuc2VsZWN0b3JfcGxheVByZXYsIFwicGxheVByZXZcIik7XG4gICAgZWxzZSAgICAgICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wbGF5UHJldiwgXCJwbGF5UHJldlwiKTtcbiAgfVxufTtcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLm11dGUgPSBmdW5jdGlvbigpIHtcbiAgaWYodGhpcy5zZWxlY3Rvcl9tdXRlKSB7XG4gICAgaWYodGhpcy5pZnJhbWUpIHRoaXMuY2xpY2tJbkZyYW1lKHRoaXMuc2VsZWN0b3JfaWZyYW1lLCB0aGlzLnNlbGVjdG9yX211dGUsIFwibXV0ZVwiKTtcbiAgICBlbHNlICAgICAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX211dGUsIFwibXV0ZVwiKTtcbiAgfVxufTtcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmRvUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gIGlmKHR5cGVvZiByZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJwbGF5X3BhdXNlXCIpIHRoaXMucGxheVBhdXNlKCk7XG4gICAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJwbGF5X25leHRcIikgdGhpcy5wbGF5TmV4dCgpO1xuICAgIGlmKHJlcXVlc3QuYWN0aW9uID09IFwicGxheV9wcmV2XCIpIHRoaXMucGxheVByZXYoKTtcbiAgICBpZihyZXF1ZXN0LmFjdGlvbiA9PSBcIm11dGVcIikgdGhpcy5tdXRlKCk7XG4gIH1cbn07XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5hdHRhY2hMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIodGhpcy5kb1JlcXVlc3QuYmluZCh0aGlzKSk7XG4gIHNrX2xvZyhcIkF0dGFjaGVkIGxpc3RlbmVyIGZvciBcIiwgdGhpcyk7XG59O1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUuYXR0YWNoRnJhbWVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIodGhpcy5kb1JlcXVlc3QuYmluZCh0aGlzKSk7XG4gIHNrX2xvZyhcIkF0dGFjaGVkIGZyYW1lIGxpc3RlbmVyIGZvciBcIiwgdGhpcyk7XG59O1xuXG5cbnZhciBzaW5nbGV0b24gPSBuZXcgQmFzZUNvbnRyb2xsZXIoKTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7IHNpbmdsZXRvbi5pbml0KG9wdGlvbnMpOyB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2tfbG9nOiBmdW5jdGlvbihtc2csIG9iaiwgZXJyKSB7XG4gICAgb2JqID0gb2JqIHx8IFwiXCI7XG4gICAgaWYoZXJyKSB7IGNvbnNvbGUuZXJyb3IoXCJTVFJFQU1LRVlTLUVSUk9SOiBcIiArIG1zZywgb2JqKTsgfVxuICAgIGVsc2UgeyBjb25zb2xlLmxvZyhcIlNUUkVBTUtFWVMtSU5GTzogXCIgKyBtc2csIG9iaik7IH1cbiAgfVxufTtcbiJdfQ==
