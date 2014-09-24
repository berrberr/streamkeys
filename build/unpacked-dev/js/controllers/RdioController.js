(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: ".play_pause",
    playNext: ".next",
    playPrev: ".prev",
    mute: ".Volume"
  });
})();

},{"../modules/BaseController.js":2}],2:[function(require,module,exports){
;(function() {
  "use strict";

  var BaseController = function() { return this; };
  var sk_log = require("../modules/sk_log.js");

  BaseController.prototype.init = function(options) {
    this.name = document.location.hostname;

    //** Inject console log formatter **//

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

    chrome.runtime.sendMessage({created: true}, function() {
      sk_log("Told BG we are created");
    });

    sk_log("SK content script loaded");
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

  BaseController.prototype.doRequest = function(request) {
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
  };
})();

},{"../modules/sk_log.js":3}],3:[function(require,module,exports){
;(function() {
  "use strict";

  module.exports = function(msg, obj, err) {
    obj = obj || "";
    if(err) { console.error("STREAMKEYS-ERROR: " + msg, obj); }
    else { console.log("STREAMKEYS-INFO: " + msg, obj); }
  };
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4Zy9Eb2N1bWVudHMvc2NyaXB0cy9zdHJlYW1rZXlzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleGcvRG9jdW1lbnRzL3NjcmlwdHMvc3RyZWFta2V5cy9jb2RlL2pzL2NvbnRyb2xsZXJzL1JkaW9Db250cm9sbGVyLmpzIiwiL1VzZXJzL2FsZXhnL0RvY3VtZW50cy9zY3JpcHRzL3N0cmVhbWtleXMvY29kZS9qcy9tb2R1bGVzL0Jhc2VDb250cm9sbGVyLmpzIiwiL1VzZXJzL2FsZXhnL0RvY3VtZW50cy9zY3JpcHRzL3N0cmVhbWtleXMvY29kZS9qcy9tb2R1bGVzL3NrX2xvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgcmVxdWlyZShcIi4uL21vZHVsZXMvQmFzZUNvbnRyb2xsZXIuanNcIikuaW5pdCh7XG4gICAgcGxheVBhdXNlOiBcIi5wbGF5X3BhdXNlXCIsXG4gICAgcGxheU5leHQ6IFwiLm5leHRcIixcbiAgICBwbGF5UHJldjogXCIucHJldlwiLFxuICAgIG11dGU6IFwiLlZvbHVtZVwiXG4gIH0pO1xufSkoKTtcbiIsIjsoZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBCYXNlQ29udHJvbGxlciA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfTtcbiAgdmFyIHNrX2xvZyA9IHJlcXVpcmUoXCIuLi9tb2R1bGVzL3NrX2xvZy5qc1wiKTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBkb2N1bWVudC5sb2NhdGlvbi5ob3N0bmFtZTtcblxuICAgIC8vKiogSW5qZWN0IGNvbnNvbGUgbG9nIGZvcm1hdHRlciAqKi8vXG5cbiAgICAvLyoqIFByb3BlcnRpZXMgKiovL1xuICAgIHRoaXMuc2VsZWN0b3JfcGxheVBhdXNlID0gb3B0aW9ucy5wbGF5UGF1c2UgfHwgbnVsbDtcbiAgICB0aGlzLnNlbGVjdG9yX3BsYXkgPSBvcHRpb25zLnBsYXkgfHwgbnVsbDtcbiAgICB0aGlzLnNlbGVjdG9yX3BhdXNlID0gb3B0aW9ucy5wYXVzZSB8fCBudWxsO1xuICAgIHRoaXMuc2VsZWN0b3JfcGxheU5leHQgPSBvcHRpb25zLnBsYXlOZXh0IHx8IG51bGw7XG4gICAgdGhpcy5zZWxlY3Rvcl9wbGF5UHJldiA9IG9wdGlvbnMucGxheVByZXYgfHwgbnVsbDtcbiAgICB0aGlzLnNlbGVjdG9yX211dGUgPSBvcHRpb25zLm11dGUgfHwgbnVsbDtcbiAgICB0aGlzLnNlbGVjdG9yX2lmcmFtZSA9IG9wdGlvbnMuaWZyYW1lIHx8IG51bGw7XG5cbiAgICAvL09wdGlvbmFsLiBTdHlsZSBvZiBwbGF5IGFuZCBwYXVzZSBidXR0b25zIHdoZW4gdGhleSBhcmUgTk9UIGluIHVzZVxuICAgIC8vRVg6IFdoZW4gYSBwbGF5IGJ1dHRvbiBpcyBpbiB1c2UsIGNzcyBjbGFzcyBcInBsYXlpbmdcIiBpcyBhZGRlZFxuICAgIC8vSW4gdGhhdCBjYXNlLCBzZXQgcGxheVN0eWxlIHRvIFwicGxheWluZ1wiXG4gICAgdGhpcy5wbGF5U3R5bGUgPSBvcHRpb25zLnBsYXlTdHlsZSB8fCBudWxsO1xuICAgIHRoaXMucGF1c2VTdHlsZSA9IG9wdGlvbnMucGF1c2VTdHlsZSB8fCBudWxsO1xuXG4gICAgdGhpcy5pZnJhbWUgPSAodHlwZW9mIG9wdGlvbnMuaWZyYW1lID09PSBcInN0cmluZ1wiKTtcblxuICAgIC8vU2V0IHRvIHRydWUgaWYgdGhlIHBsYXkvcGF1c2UgYnV0dG9ucyBzaGFyZSB0aGUgc2FtZSBlbGVtZW50XG4gICAgdGhpcy5idXR0b25Td2l0Y2ggPSBvcHRpb25zLmJ1dHRvblN3aXRjaCB8fCBmYWxzZTtcblxuICAgIC8vRGVmYXVsdCBsaXN0ZW5lciBzZW5kcyBhY3Rpb25zIHRvIG1haW4gZG9jdW1lbnRcbiAgICBpZih0aGlzLmlmcmFtZSkge1xuICAgICAgdGhpcy5hdHRhY2hGcmFtZUxpc3RlbmVyKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXR0YWNoTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7Y3JlYXRlZDogdHJ1ZX0sIGZ1bmN0aW9uKCkge1xuICAgICAgc2tfbG9nKFwiVG9sZCBCRyB3ZSBhcmUgY3JlYXRlZFwiKTtcbiAgICB9KTtcblxuICAgIHNrX2xvZyhcIlNLIGNvbnRlbnQgc2NyaXB0IGxvYWRlZFwiKTtcbiAgfTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUuaW5qZWN0U2NyaXB0ID0gZnVuY3Rpb24oZmlsZSkge1xuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dC9qYXZhc2NyaXB0XCIpO1xuICAgIGlmKGZpbGUudXJsKSB7c2NyaXB0LnNldEF0dHJpYnV0ZShcInNyY1wiLCBjaHJvbWUuZXh0ZW5zaW9uLmdldFVSTChmaWxlLnVybCkpO31cbiAgICBpZihmaWxlLnNjcmlwdCkge3NjcmlwdC5pbm5lckhUTUwgPSBmaWxlLnNjcmlwdDt9XG4gICAgKGRvY3VtZW50LmhlYWR8fGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgfTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUuaXNQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXlFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zZWxlY3Rvcl9wbGF5KSxcbiAgICAgICAgZGlzcGxheVN0eWxlID0gXCJub25lXCIsXG4gICAgICAgIGlzUGxheWluZyA9IGZhbHNlO1xuXG4gICAgaWYodGhpcy5idXR0b25Td2l0Y2gpIHtcbiAgICAgIC8vSWYgcGxheUVsIGRvZXMgbm90IGV4aXN0IHRoZW4gaXQgaXMgY3VycmVudGx5IHBsYXlpbmdcbiAgICAgIGlzUGxheWluZyA9IChwbGF5RWwgPT09IG51bGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL0NoZWNrIGZvciBwbGF5L3BhdXNlIHN0eWxlIG92ZXJyaWRlc1xuICAgICAgaWYodGhpcy5wbGF5U3R5bGUgJiYgdGhpcy5wYXVzZVN0eWxlKSB7XG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGNsYXNzIGxpc3QgY29udGFpbnMgdGhlIGNsYXNzIHRoYXQgaXMgb25seSBhY3RpdmUgd2hlbiBwbGF5IGJ1dHRvbiBpcyBwbGF5aW5nXG4gICAgICAgIGlzUGxheWluZyA9IHBsYXlFbC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5wbGF5U3R5bGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9oYWNrIHRvIGdldCBhcm91bmQgc29tZXRpbWVzIG5vdCBiZWluZyBhYmxlIHRvIHJlYWQgY3NzIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IGlubGluZVxuICAgICAgICBpZiAocGxheUVsLmN1cnJlbnRTdHlsZSkge1xuICAgICAgICAgIGRpc3BsYXlTdHlsZSA9IHBsYXlFbC5jdXJyZW50U3R5bGUuZGlzcGxheTtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgIGRpc3BsYXlTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHBsYXlFbCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImRpc3BsYXlcIik7XG4gICAgICAgIH1cbiAgICAgICAgaXNQbGF5aW5nID0gKGRpc3BsYXlTdHlsZSA9PSBcIm5vbmVcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2tfbG9nKFwiSXNQbGF5aW5nOiBcIiArIGlzUGxheWluZyk7XG4gICAgcmV0dXJuIGlzUGxheWluZztcbiAgfTtcblxuICAvLyoqIENsaWNrIGluc2lkZSBkb2N1bWVudCAqKi8vXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5jbGljayA9IGZ1bmN0aW9uKHNlbGVjdG9yQnV0dG9uLCBhY3Rpb24pIHtcbiAgICB2YXIgZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvckJ1dHRvbik7XG5cbiAgICB0cnkge1xuICAgICAgZWxlLmNsaWNrKCk7XG4gICAgICBza19sb2coYWN0aW9uKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIHNrX2xvZyhcIkVsZW1lbnQgbm90IGZvdW5kIGZvciBjbGljay5cIiwgc2VsZWN0b3JCdXR0b24sIHRydWUpO1xuICAgIH1cbiAgfTtcblxuICAvLyoqIENsaWNrIGluc2lkZSBhbiBpZnJhbWUgKiovL1xuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xpY2tJbkZyYW1lID0gZnVuY3Rpb24oc2VsZWN0b3JGcmFtZSwgc2VsZWN0b3JCdXR0b24sIGFjdGlvbikge1xuICAgIHZhciBkb2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yRnJhbWUpLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gICAgaWYgKCFkb2MpIHJldHVybiBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIGRvYy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yQnV0dG9uKS5jbGljaygpO1xuICAgICAgc2tfbG9nKGFjdGlvbik7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBza19sb2coXCJFbGVtZW50IG5vdCBmb3VuZCBmb3IgY2xpY2suXCIsIHNlbGVjdG9yQnV0dG9uLCB0cnVlKTtcbiAgICB9XG4gIH07XG5cbiAgLy9UT0RPOiBtYWtlIGlzUGxheWluZyB3b3JrIHdpdGggaWZyYW1lc1xuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUucGxheVBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5zZWxlY3Rvcl9wbGF5ICE9PSBudWxsICYmIHRoaXMuc2VsZWN0b3JfcGF1c2UgIT09IG51bGwpIHtcbiAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKCkpIHtcbiAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BhdXNlLCBcInBsYXlQYXVzZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wbGF5LCBcInBsYXlQYXVzZVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYodGhpcy5pZnJhbWUpIHRoaXMuY2xpY2tJbkZyYW1lKHRoaXMuc2VsZWN0b3JfaWZyYW1lLCB0aGlzLnNlbGVjdG9yX3BsYXlQYXVzZSwgXCJwbGF5UGF1c2VcIik7XG4gICAgICBlbHNlICAgICAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXlQYXVzZSwgXCJwbGF5UGF1c2VcIik7XG4gICAgfVxuICB9O1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5TmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuc2VsZWN0b3JfcGxheU5leHQpIHtcbiAgICAgIGlmKHRoaXMuaWZyYW1lKSB0aGlzLmNsaWNrSW5GcmFtZSh0aGlzLnNlbGVjdG9yX2lmcmFtZSwgdGhpcy5zZWxlY3Rvcl9wbGF5TmV4dCwgXCJwbGF5TmV4dFwiKTtcbiAgICAgIGVsc2UgICAgICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheU5leHQsIFwicGxheU5leHRcIik7XG4gICAgfVxuICB9O1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5UHJldiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuc2VsZWN0b3JfcGxheVByZXYpIHtcbiAgICAgIGlmKHRoaXMuaWZyYW1lKSB0aGlzLmNsaWNrSW5GcmFtZSh0aGlzLnNlbGVjdG9yX2lmcmFtZSwgdGhpcy5zZWxlY3Rvcl9wbGF5UHJldiwgXCJwbGF5UHJldlwiKTtcbiAgICAgIGVsc2UgICAgICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheVByZXYsIFwicGxheVByZXZcIik7XG4gICAgfVxuICB9O1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5tdXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5zZWxlY3Rvcl9tdXRlKSB7XG4gICAgICBpZih0aGlzLmlmcmFtZSkgdGhpcy5jbGlja0luRnJhbWUodGhpcy5zZWxlY3Rvcl9pZnJhbWUsIHRoaXMuc2VsZWN0b3JfbXV0ZSwgXCJtdXRlXCIpO1xuICAgICAgZWxzZSAgICAgICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9tdXRlLCBcIm11dGVcIik7XG4gICAgfVxuICB9O1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5kb1JlcXVlc3QgPSBmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgaWYodHlwZW9mIHJlcXVlc3QgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmKHJlcXVlc3QuYWN0aW9uID09IFwicGxheV9wYXVzZVwiKSB0aGlzLnBsYXlQYXVzZSgpO1xuICAgICAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJwbGF5X25leHRcIikgdGhpcy5wbGF5TmV4dCgpO1xuICAgICAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJwbGF5X3ByZXZcIikgdGhpcy5wbGF5UHJldigpO1xuICAgICAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJtdXRlXCIpIHRoaXMubXV0ZSgpO1xuICAgIH1cbiAgfTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUuYXR0YWNoTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIodGhpcy5kb1JlcXVlc3QuYmluZCh0aGlzKSk7XG4gICAgc2tfbG9nKFwiQXR0YWNoZWQgbGlzdGVuZXIgZm9yIFwiLCB0aGlzKTtcbiAgfTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUuYXR0YWNoRnJhbWVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcih0aGlzLmRvUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgICBza19sb2coXCJBdHRhY2hlZCBmcmFtZSBsaXN0ZW5lciBmb3IgXCIsIHRoaXMpO1xuICB9O1xuXG5cbiAgdmFyIHNpbmdsZXRvbiA9IG5ldyBCYXNlQ29udHJvbGxlcigpO1xuICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zKSB7IHNpbmdsZXRvbi5pbml0KG9wdGlvbnMpOyB9XG4gIH07XG59KSgpO1xuIiwiOyhmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtc2csIG9iaiwgZXJyKSB7XG4gICAgb2JqID0gb2JqIHx8IFwiXCI7XG4gICAgaWYoZXJyKSB7IGNvbnNvbGUuZXJyb3IoXCJTVFJFQU1LRVlTLUVSUk9SOiBcIiArIG1zZywgb2JqKTsgfVxuICAgIGVsc2UgeyBjb25zb2xlLmxvZyhcIlNUUkVBTUtFWVMtSU5GTzogXCIgKyBtc2csIG9iaik7IH1cbiAgfTtcbn0pKCk7XG4iXX0=
