(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//var controller = new BaseController();

// controller.init({
//   playPause: ".playbutton",
//   playNext: ".nextbutton",
//   playPrev: ".prevbutton"
// });

;(function() {
  var controller = require("../modules/BaseController.js").init({
    playPause: ".playbutton",
    playNext: ".nextbutton",
    playPrev: ".prevbutton"
  });
})();

},{"../modules/BaseController.js":2}],2:[function(require,module,exports){
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

},{"../modules/sk_log.js":3}],3:[function(require,module,exports){
module.exports = {
  sk_log: function(msg, obj, err) {
    obj = obj || "";
    if(err) { console.error("STREAMKEYS-ERROR: " + msg, obj); }
    else { console.log("STREAMKEYS-INFO: " + msg, obj); }
  }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9jb250cm9sbGVycy9CYW5kY2FtcENvbnRyb2xsZXIuanMiLCIvVXNlcnMvYWxleC9zdHJlYW1rZXlzL2NvZGUvanMvbW9kdWxlcy9CYXNlQ29udHJvbGxlci5qcyIsIi9Vc2Vycy9hbGV4L3N0cmVhbWtleXMvY29kZS9qcy9tb2R1bGVzL3NrX2xvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy92YXIgY29udHJvbGxlciA9IG5ldyBCYXNlQ29udHJvbGxlcigpO1xuXG4vLyBjb250cm9sbGVyLmluaXQoe1xuLy8gICBwbGF5UGF1c2U6IFwiLnBsYXlidXR0b25cIixcbi8vICAgcGxheU5leHQ6IFwiLm5leHRidXR0b25cIixcbi8vICAgcGxheVByZXY6IFwiLnByZXZidXR0b25cIlxuLy8gfSk7XG5cbjsoZnVuY3Rpb24oKSB7XG4gIHZhciBjb250cm9sbGVyID0gcmVxdWlyZShcIi4uL21vZHVsZXMvQmFzZUNvbnRyb2xsZXIuanNcIikuaW5pdCh7XG4gICAgcGxheVBhdXNlOiBcIi5wbGF5YnV0dG9uXCIsXG4gICAgcGxheU5leHQ6IFwiLm5leHRidXR0b25cIixcbiAgICBwbGF5UHJldjogXCIucHJldmJ1dHRvblwiXG4gIH0pO1xufSkoKTtcbiIsInZhciBCYXNlQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfTtcbnZhciBza19sb2cgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9za19sb2cuanNcIikuc2tfbG9nO1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gZG9jdW1lbnQubG9jYXRpb24uaG9zdG5hbWU7XG5cbiAgLy8qKiBJbmplY3QgY29uc29sZSBsb2cgZm9ybWF0dGVyICoqLy9cbiAgLy90aGlzLmluamVjdFNjcmlwdCh7c2NyaXB0OiBza19sb2d9KTtcblxuICAvLyoqIFByb3BlcnRpZXMgKiovL1xuICB0aGlzLnNlbGVjdG9yX3BsYXlQYXVzZSA9IG9wdGlvbnMucGxheVBhdXNlIHx8IG51bGw7XG4gIHRoaXMuc2VsZWN0b3JfcGxheSA9IG9wdGlvbnMucGxheSB8fCBudWxsO1xuICB0aGlzLnNlbGVjdG9yX3BhdXNlID0gb3B0aW9ucy5wYXVzZSB8fCBudWxsO1xuICB0aGlzLnNlbGVjdG9yX3BsYXlOZXh0ID0gb3B0aW9ucy5wbGF5TmV4dCB8fCBudWxsO1xuICB0aGlzLnNlbGVjdG9yX3BsYXlQcmV2ID0gb3B0aW9ucy5wbGF5UHJldiB8fCBudWxsO1xuICB0aGlzLnNlbGVjdG9yX211dGUgPSBvcHRpb25zLm11dGUgfHwgbnVsbDtcbiAgdGhpcy5zZWxlY3Rvcl9pZnJhbWUgPSBvcHRpb25zLmlmcmFtZSB8fCBudWxsO1xuXG4gIC8vT3B0aW9uYWwuIFN0eWxlIG9mIHBsYXkgYW5kIHBhdXNlIGJ1dHRvbnMgd2hlbiB0aGV5IGFyZSBOT1QgaW4gdXNlXG4gIC8vRVg6IFdoZW4gYSBwbGF5IGJ1dHRvbiBpcyBpbiB1c2UsIGNzcyBjbGFzcyBcInBsYXlpbmdcIiBpcyBhZGRlZFxuICAvL0luIHRoYXQgY2FzZSwgc2V0IHBsYXlTdHlsZSB0byBcInBsYXlpbmdcIlxuICB0aGlzLnBsYXlTdHlsZSA9IG9wdGlvbnMucGxheVN0eWxlIHx8IG51bGw7XG4gIHRoaXMucGF1c2VTdHlsZSA9IG9wdGlvbnMucGF1c2VTdHlsZSB8fCBudWxsO1xuXG4gIHRoaXMuaWZyYW1lID0gKHR5cGVvZiBvcHRpb25zLmlmcmFtZSA9PT0gXCJzdHJpbmdcIik7XG5cbiAgLy9TZXQgdG8gdHJ1ZSBpZiB0aGUgcGxheS9wYXVzZSBidXR0b25zIHNoYXJlIHRoZSBzYW1lIGVsZW1lbnRcbiAgdGhpcy5idXR0b25Td2l0Y2ggPSBvcHRpb25zLmJ1dHRvblN3aXRjaCB8fCBmYWxzZTtcblxuICAvL0RlZmF1bHQgbGlzdGVuZXIgc2VuZHMgYWN0aW9ucyB0byBtYWluIGRvY3VtZW50XG4gIGlmKHRoaXMuaWZyYW1lKSB7XG4gICAgdGhpcy5hdHRhY2hGcmFtZUxpc3RlbmVyKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hdHRhY2hMaXN0ZW5lcigpO1xuICB9XG5cbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2NyZWF0ZWQ6IHRydWV9LCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgc2tfbG9nKFwiVG9sZCBCRyB3ZSBhcmUgY3JlYXRlZFwiKTtcbiAgfSk7XG5cbiAgc2tfbG9nKFwiU0sgY29udGVudCBzY3JpcHQgbG9hZGVkXCIpO1xufTtcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmluamVjdFNjcmlwdCA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XG4gIGlmKGZpbGUudXJsKSB7c2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgY2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoZmlsZS51cmwpKTt9XG4gIGlmKGZpbGUuc2NyaXB0KSB7c2NyaXB0LmlubmVySFRNTCA9IGZpbGUuc2NyaXB0O31cbiAgKGRvY3VtZW50LmhlYWR8fGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn07XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5pc1BsYXlpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBsYXlFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3Rvcl9wbGF5KSxcbiAgICAgIGRpc3BsYXlTdHlsZSA9IFwibm9uZVwiLFxuICAgICAgaXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgaWYodGhpcy5idXR0b25Td2l0Y2gpIHtcbiAgICAvL0lmIHBsYXlFbCBkb2VzIG5vdCBleGlzdCB0aGVuIGl0IGlzIGN1cnJlbnRseSBwbGF5aW5nXG4gICAgaXNQbGF5aW5nID0gKHBsYXlFbCA9PT0gbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgLy9DaGVjayBmb3IgcGxheS9wYXVzZSBzdHlsZSBvdmVycmlkZXNcbiAgICBpZih0aGlzLnBsYXlTdHlsZSAmJiB0aGlzLnBhdXNlU3R5bGUpIHtcbiAgICAgIC8vQ2hlY2sgaWYgdGhlIGNsYXNzIGxpc3QgY29udGFpbnMgdGhlIGNsYXNzIHRoYXQgaXMgb25seSBhY3RpdmUgd2hlbiBwbGF5IGJ1dHRvbiBpcyBwbGF5aW5nXG4gICAgICBpc1BsYXlpbmcgPSBwbGF5RWwuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMucGxheVN0eWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9oYWNrIHRvIGdldCBhcm91bmQgc29tZXRpbWVzIG5vdCBiZWluZyBhYmxlIHRvIHJlYWQgY3NzIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IGlubGluZVxuICAgICAgaWYgKHBsYXlFbC5jdXJyZW50U3R5bGUpIHtcbiAgICAgICAgZGlzcGxheVN0eWxlID0gcGxheUVsLmN1cnJlbnRTdHlsZS5kaXNwbGF5O1xuICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICBkaXNwbGF5U3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwbGF5RWwsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJkaXNwbGF5XCIpO1xuICAgICAgfVxuICAgICAgaXNQbGF5aW5nID0gKGRpc3BsYXlTdHlsZSA9PSBcIm5vbmVcIik7XG4gICAgfVxuICB9XG5cbiAgc2tfbG9nKFwiSXNQbGF5aW5nOiBcIiArIGlzUGxheWluZyk7XG4gIHJldHVybiBpc1BsYXlpbmc7XG59O1xuXG4vLyoqIENsaWNrIGluc2lkZSBkb2N1bWVudCAqKi8vXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xpY2sgPSBmdW5jdGlvbihzZWxlY3RvckJ1dHRvbiwgYWN0aW9uKSB7XG4gIHZhciBlbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yQnV0dG9uKTtcblxuICB0cnkge1xuICAgIGVsZS5jbGljaygpO1xuICAgIHNrX2xvZyhhY3Rpb24pO1xuICB9IGNhdGNoKGUpIHtcbiAgICBza19sb2coXCJFbGVtZW50IG5vdCBmb3VuZCBmb3IgY2xpY2suXCIsIHNlbGVjdG9yQnV0dG9uLCB0cnVlKTtcbiAgfVxufTtcblxuLy8qKiBDbGljayBpbnNpZGUgYW4gaWZyYW1lICoqLy9cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5jbGlja0luRnJhbWUgPSBmdW5jdGlvbihzZWxlY3RvckZyYW1lLCBzZWxlY3RvckJ1dHRvbiwgYWN0aW9uKSB7XG4gIHZhciBkb2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yRnJhbWUpLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmICghZG9jKSByZXR1cm4gbnVsbDtcblxuICB0cnkge1xuICAgIGRvYy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yQnV0dG9uKS5jbGljaygpO1xuICAgIHNrX2xvZyhhY3Rpb24pO1xuICB9IGNhdGNoKGUpIHtcbiAgICBza19sb2coXCJFbGVtZW50IG5vdCBmb3VuZCBmb3IgY2xpY2suXCIsIHNlbGVjdG9yQnV0dG9uLCB0cnVlKTtcbiAgfVxufTtcblxuLy9UT0RPOiBtYWtlIGlzUGxheWluZyB3b3JrIHdpdGggaWZyYW1lc1xuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXlQYXVzZSA9IGZ1bmN0aW9uKCkge1xuICBpZih0aGlzLnNlbGVjdG9yX3BsYXkgIT09IG51bGwgJiYgdGhpcy5zZWxlY3Rvcl9wYXVzZSAhPT0gbnVsbCkge1xuICAgIGlmKHRoaXMuaXNQbGF5aW5nKCkpIHtcbiAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wYXVzZSwgXCJwbGF5UGF1c2VcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wbGF5LCBcInBsYXlQYXVzZVwiKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYodGhpcy5pZnJhbWUpIHRoaXMuY2xpY2tJbkZyYW1lKHRoaXMuc2VsZWN0b3JfaWZyYW1lLCB0aGlzLnNlbGVjdG9yX3BsYXlQYXVzZSwgXCJwbGF5UGF1c2VcIik7XG4gICAgZWxzZSAgICAgICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wbGF5UGF1c2UsIFwicGxheVBhdXNlXCIpO1xuICB9XG59O1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUucGxheU5leHQgPSBmdW5jdGlvbigpIHtcbiAgaWYodGhpcy5zZWxlY3Rvcl9wbGF5TmV4dCkge1xuICAgIGlmKHRoaXMuaWZyYW1lKSB0aGlzLmNsaWNrSW5GcmFtZSh0aGlzLnNlbGVjdG9yX2lmcmFtZSwgdGhpcy5zZWxlY3Rvcl9wbGF5TmV4dCwgXCJwbGF5TmV4dFwiKTtcbiAgICBlbHNlICAgICAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXlOZXh0LCBcInBsYXlOZXh0XCIpO1xuICB9XG59O1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUucGxheVByZXYgPSBmdW5jdGlvbigpIHtcbiAgaWYodGhpcy5zZWxlY3Rvcl9wbGF5UHJldikge1xuICAgIGlmKHRoaXMuaWZyYW1lKSB0aGlzLmNsaWNrSW5GcmFtZSh0aGlzLnNlbGVjdG9yX2lmcmFtZSwgdGhpcy5zZWxlY3Rvcl9wbGF5UHJldiwgXCJwbGF5UHJldlwiKTtcbiAgICBlbHNlICAgICAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXlQcmV2LCBcInBsYXlQcmV2XCIpO1xuICB9XG59O1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUubXV0ZSA9IGZ1bmN0aW9uKCkge1xuICBpZih0aGlzLnNlbGVjdG9yX211dGUpIHtcbiAgICBpZih0aGlzLmlmcmFtZSkgdGhpcy5jbGlja0luRnJhbWUodGhpcy5zZWxlY3Rvcl9pZnJhbWUsIHRoaXMuc2VsZWN0b3JfbXV0ZSwgXCJtdXRlXCIpO1xuICAgIGVsc2UgICAgICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfbXV0ZSwgXCJtdXRlXCIpO1xuICB9XG59O1xuXG5CYXNlQ29udHJvbGxlci5wcm90b3R5cGUuZG9SZXF1ZXN0ID0gZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgaWYodHlwZW9mIHJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBpZihyZXF1ZXN0LmFjdGlvbiA9PSBcInBsYXlfcGF1c2VcIikgdGhpcy5wbGF5UGF1c2UoKTtcbiAgICBpZihyZXF1ZXN0LmFjdGlvbiA9PSBcInBsYXlfbmV4dFwiKSB0aGlzLnBsYXlOZXh0KCk7XG4gICAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJwbGF5X3ByZXZcIikgdGhpcy5wbGF5UHJldigpO1xuICAgIGlmKHJlcXVlc3QuYWN0aW9uID09IFwibXV0ZVwiKSB0aGlzLm11dGUoKTtcbiAgfVxufTtcblxuQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmF0dGFjaExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcih0aGlzLmRvUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgc2tfbG9nKFwiQXR0YWNoZWQgbGlzdGVuZXIgZm9yIFwiLCB0aGlzKTtcbn07XG5cbkJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5hdHRhY2hGcmFtZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcih0aGlzLmRvUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgc2tfbG9nKFwiQXR0YWNoZWQgZnJhbWUgbGlzdGVuZXIgZm9yIFwiLCB0aGlzKTtcbn07XG5cblxudmFyIHNpbmdsZXRvbiA9IG5ldyBCYXNlQ29udHJvbGxlcigpO1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHsgc2luZ2xldG9uLmluaXQob3B0aW9ucyk7IH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBza19sb2c6IGZ1bmN0aW9uKG1zZywgb2JqLCBlcnIpIHtcbiAgICBvYmogPSBvYmogfHwgXCJcIjtcbiAgICBpZihlcnIpIHsgY29uc29sZS5lcnJvcihcIlNUUkVBTUtFWVMtRVJST1I6IFwiICsgbXNnLCBvYmopOyB9XG4gICAgZWxzZSB7IGNvbnNvbGUubG9nKFwiU1RSRUFNS0VZUy1JTkZPOiBcIiArIG1zZywgb2JqKTsgfVxuICB9XG59O1xuIl19
