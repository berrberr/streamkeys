(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "#mini-play",
    playNext: "#mini-skip",
    mute: ".volume-icon"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4Zy9Eb2N1bWVudHMvc2NyaXB0cy9zdHJlYW1rZXlzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleGcvRG9jdW1lbnRzL3NjcmlwdHMvc3RyZWFta2V5cy9jb2RlL2pzL2NvbnRyb2xsZXJzL1NsYWNrZXJDb250cm9sbGVyLmpzIiwiL1VzZXJzL2FsZXhnL0RvY3VtZW50cy9zY3JpcHRzL3N0cmVhbWtleXMvY29kZS9qcy9tb2R1bGVzL0Jhc2VDb250cm9sbGVyLmpzIiwiL1VzZXJzL2FsZXhnL0RvY3VtZW50cy9zY3JpcHRzL3N0cmVhbWtleXMvY29kZS9qcy9tb2R1bGVzL3NrX2xvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHJlcXVpcmUoXCIuLi9tb2R1bGVzL0Jhc2VDb250cm9sbGVyLmpzXCIpLmluaXQoe1xuICAgIHBsYXlQYXVzZTogXCIjbWluaS1wbGF5XCIsXG4gICAgcGxheU5leHQ6IFwiI21pbmktc2tpcFwiLFxuICAgIG11dGU6IFwiLnZvbHVtZS1pY29uXCJcbiAgfSk7XG59KSgpO1xuIiwiOyhmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIEJhc2VDb250cm9sbGVyID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9O1xuICB2YXIgc2tfbG9nID0gcmVxdWlyZShcIi4uL21vZHVsZXMvc2tfbG9nLmpzXCIpO1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMubmFtZSA9IGRvY3VtZW50LmxvY2F0aW9uLmhvc3RuYW1lO1xuXG4gICAgLy8qKiBJbmplY3QgY29uc29sZSBsb2cgZm9ybWF0dGVyICoqLy9cblxuICAgIC8vKiogUHJvcGVydGllcyAqKi8vXG4gICAgdGhpcy5zZWxlY3Rvcl9wbGF5UGF1c2UgPSBvcHRpb25zLnBsYXlQYXVzZSB8fCBudWxsO1xuICAgIHRoaXMuc2VsZWN0b3JfcGxheSA9IG9wdGlvbnMucGxheSB8fCBudWxsO1xuICAgIHRoaXMuc2VsZWN0b3JfcGF1c2UgPSBvcHRpb25zLnBhdXNlIHx8IG51bGw7XG4gICAgdGhpcy5zZWxlY3Rvcl9wbGF5TmV4dCA9IG9wdGlvbnMucGxheU5leHQgfHwgbnVsbDtcbiAgICB0aGlzLnNlbGVjdG9yX3BsYXlQcmV2ID0gb3B0aW9ucy5wbGF5UHJldiB8fCBudWxsO1xuICAgIHRoaXMuc2VsZWN0b3JfbXV0ZSA9IG9wdGlvbnMubXV0ZSB8fCBudWxsO1xuICAgIHRoaXMuc2VsZWN0b3JfaWZyYW1lID0gb3B0aW9ucy5pZnJhbWUgfHwgbnVsbDtcblxuICAgIC8vT3B0aW9uYWwuIFN0eWxlIG9mIHBsYXkgYW5kIHBhdXNlIGJ1dHRvbnMgd2hlbiB0aGV5IGFyZSBOT1QgaW4gdXNlXG4gICAgLy9FWDogV2hlbiBhIHBsYXkgYnV0dG9uIGlzIGluIHVzZSwgY3NzIGNsYXNzIFwicGxheWluZ1wiIGlzIGFkZGVkXG4gICAgLy9JbiB0aGF0IGNhc2UsIHNldCBwbGF5U3R5bGUgdG8gXCJwbGF5aW5nXCJcbiAgICB0aGlzLnBsYXlTdHlsZSA9IG9wdGlvbnMucGxheVN0eWxlIHx8IG51bGw7XG4gICAgdGhpcy5wYXVzZVN0eWxlID0gb3B0aW9ucy5wYXVzZVN0eWxlIHx8IG51bGw7XG5cbiAgICB0aGlzLmlmcmFtZSA9ICh0eXBlb2Ygb3B0aW9ucy5pZnJhbWUgPT09IFwic3RyaW5nXCIpO1xuXG4gICAgLy9TZXQgdG8gdHJ1ZSBpZiB0aGUgcGxheS9wYXVzZSBidXR0b25zIHNoYXJlIHRoZSBzYW1lIGVsZW1lbnRcbiAgICB0aGlzLmJ1dHRvblN3aXRjaCA9IG9wdGlvbnMuYnV0dG9uU3dpdGNoIHx8IGZhbHNlO1xuXG4gICAgLy9EZWZhdWx0IGxpc3RlbmVyIHNlbmRzIGFjdGlvbnMgdG8gbWFpbiBkb2N1bWVudFxuICAgIGlmKHRoaXMuaWZyYW1lKSB7XG4gICAgICB0aGlzLmF0dGFjaEZyYW1lTGlzdGVuZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hdHRhY2hMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtjcmVhdGVkOiB0cnVlfSwgZnVuY3Rpb24oKSB7XG4gICAgICBza19sb2coXCJUb2xkIEJHIHdlIGFyZSBjcmVhdGVkXCIpO1xuICAgIH0pO1xuXG4gICAgc2tfbG9nKFwiU0sgY29udGVudCBzY3JpcHQgbG9hZGVkXCIpO1xuICB9O1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5pbmplY3RTY3JpcHQgPSBmdW5jdGlvbihmaWxlKSB7XG4gICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2phdmFzY3JpcHRcIik7XG4gICAgaWYoZmlsZS51cmwpIHtzY3JpcHQuc2V0QXR0cmlidXRlKFwic3JjXCIsIGNocm9tZS5leHRlbnNpb24uZ2V0VVJMKGZpbGUudXJsKSk7fVxuICAgIGlmKGZpbGUuc2NyaXB0KSB7c2NyaXB0LmlubmVySFRNTCA9IGZpbGUuc2NyaXB0O31cbiAgICAoZG9jdW1lbnQuaGVhZHx8ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB9O1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5pc1BsYXlpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNlbGVjdG9yX3BsYXkpLFxuICAgICAgICBkaXNwbGF5U3R5bGUgPSBcIm5vbmVcIixcbiAgICAgICAgaXNQbGF5aW5nID0gZmFsc2U7XG5cbiAgICBpZih0aGlzLmJ1dHRvblN3aXRjaCkge1xuICAgICAgLy9JZiBwbGF5RWwgZG9lcyBub3QgZXhpc3QgdGhlbiBpdCBpcyBjdXJyZW50bHkgcGxheWluZ1xuICAgICAgaXNQbGF5aW5nID0gKHBsYXlFbCA9PT0gbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vQ2hlY2sgZm9yIHBsYXkvcGF1c2Ugc3R5bGUgb3ZlcnJpZGVzXG4gICAgICBpZih0aGlzLnBsYXlTdHlsZSAmJiB0aGlzLnBhdXNlU3R5bGUpIHtcbiAgICAgICAgLy9DaGVjayBpZiB0aGUgY2xhc3MgbGlzdCBjb250YWlucyB0aGUgY2xhc3MgdGhhdCBpcyBvbmx5IGFjdGl2ZSB3aGVuIHBsYXkgYnV0dG9uIGlzIHBsYXlpbmdcbiAgICAgICAgaXNQbGF5aW5nID0gcGxheUVsLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnBsYXlTdHlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2hhY2sgdG8gZ2V0IGFyb3VuZCBzb21ldGltZXMgbm90IGJlaW5nIGFibGUgdG8gcmVhZCBjc3MgcHJvcGVydGllcyB0aGF0IGFyZSBub3QgaW5saW5lXG4gICAgICAgIGlmIChwbGF5RWwuY3VycmVudFN0eWxlKSB7XG4gICAgICAgICAgZGlzcGxheVN0eWxlID0gcGxheUVsLmN1cnJlbnRTdHlsZS5kaXNwbGF5O1xuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgZGlzcGxheVN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocGxheUVsLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZGlzcGxheVwiKTtcbiAgICAgICAgfVxuICAgICAgICBpc1BsYXlpbmcgPSAoZGlzcGxheVN0eWxlID09IFwibm9uZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBza19sb2coXCJJc1BsYXlpbmc6IFwiICsgaXNQbGF5aW5nKTtcbiAgICByZXR1cm4gaXNQbGF5aW5nO1xuICB9O1xuXG4gIC8vKiogQ2xpY2sgaW5zaWRlIGRvY3VtZW50ICoqLy9cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmNsaWNrID0gZnVuY3Rpb24oc2VsZWN0b3JCdXR0b24sIGFjdGlvbikge1xuICAgIHZhciBlbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yQnV0dG9uKTtcblxuICAgIHRyeSB7XG4gICAgICBlbGUuY2xpY2soKTtcbiAgICAgIHNrX2xvZyhhY3Rpb24pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgc2tfbG9nKFwiRWxlbWVudCBub3QgZm91bmQgZm9yIGNsaWNrLlwiLCBzZWxlY3RvckJ1dHRvbiwgdHJ1ZSk7XG4gICAgfVxuICB9O1xuXG4gIC8vKiogQ2xpY2sgaW5zaWRlIGFuIGlmcmFtZSAqKi8vXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5jbGlja0luRnJhbWUgPSBmdW5jdGlvbihzZWxlY3RvckZyYW1lLCBzZWxlY3RvckJ1dHRvbiwgYWN0aW9uKSB7XG4gICAgdmFyIGRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JGcmFtZSkuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgICBpZiAoIWRvYykgcmV0dXJuIG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgZG9jLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JCdXR0b24pLmNsaWNrKCk7XG4gICAgICBza19sb2coYWN0aW9uKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIHNrX2xvZyhcIkVsZW1lbnQgbm90IGZvdW5kIGZvciBjbGljay5cIiwgc2VsZWN0b3JCdXR0b24sIHRydWUpO1xuICAgIH1cbiAgfTtcblxuICAvL1RPRE86IG1ha2UgaXNQbGF5aW5nIHdvcmsgd2l0aCBpZnJhbWVzXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5wbGF5UGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnNlbGVjdG9yX3BsYXkgIT09IG51bGwgJiYgdGhpcy5zZWxlY3Rvcl9wYXVzZSAhPT0gbnVsbCkge1xuICAgICAgaWYodGhpcy5pc1BsYXlpbmcoKSkge1xuICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGF1c2UsIFwicGxheVBhdXNlXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXksIFwicGxheVBhdXNlXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZih0aGlzLmlmcmFtZSkgdGhpcy5jbGlja0luRnJhbWUodGhpcy5zZWxlY3Rvcl9pZnJhbWUsIHRoaXMuc2VsZWN0b3JfcGxheVBhdXNlLCBcInBsYXlQYXVzZVwiKTtcbiAgICAgIGVsc2UgICAgICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheVBhdXNlLCBcInBsYXlQYXVzZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXlOZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5zZWxlY3Rvcl9wbGF5TmV4dCkge1xuICAgICAgaWYodGhpcy5pZnJhbWUpIHRoaXMuY2xpY2tJbkZyYW1lKHRoaXMuc2VsZWN0b3JfaWZyYW1lLCB0aGlzLnNlbGVjdG9yX3BsYXlOZXh0LCBcInBsYXlOZXh0XCIpO1xuICAgICAgZWxzZSAgICAgICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wbGF5TmV4dCwgXCJwbGF5TmV4dFwiKTtcbiAgICB9XG4gIH07XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXlQcmV2ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5zZWxlY3Rvcl9wbGF5UHJldikge1xuICAgICAgaWYodGhpcy5pZnJhbWUpIHRoaXMuY2xpY2tJbkZyYW1lKHRoaXMuc2VsZWN0b3JfaWZyYW1lLCB0aGlzLnNlbGVjdG9yX3BsYXlQcmV2LCBcInBsYXlQcmV2XCIpO1xuICAgICAgZWxzZSAgICAgICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wbGF5UHJldiwgXCJwbGF5UHJldlwiKTtcbiAgICB9XG4gIH07XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLm11dGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnNlbGVjdG9yX211dGUpIHtcbiAgICAgIGlmKHRoaXMuaWZyYW1lKSB0aGlzLmNsaWNrSW5GcmFtZSh0aGlzLnNlbGVjdG9yX2lmcmFtZSwgdGhpcy5zZWxlY3Rvcl9tdXRlLCBcIm11dGVcIik7XG4gICAgICBlbHNlICAgICAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX211dGUsIFwibXV0ZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmRvUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICBpZih0eXBlb2YgcmVxdWVzdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaWYocmVxdWVzdC5hY3Rpb24gPT0gXCJwbGF5X3BhdXNlXCIpIHRoaXMucGxheVBhdXNlKCk7XG4gICAgICBpZihyZXF1ZXN0LmFjdGlvbiA9PSBcInBsYXlfbmV4dFwiKSB0aGlzLnBsYXlOZXh0KCk7XG4gICAgICBpZihyZXF1ZXN0LmFjdGlvbiA9PSBcInBsYXlfcHJldlwiKSB0aGlzLnBsYXlQcmV2KCk7XG4gICAgICBpZihyZXF1ZXN0LmFjdGlvbiA9PSBcIm11dGVcIikgdGhpcy5tdXRlKCk7XG4gICAgfVxuICB9O1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5hdHRhY2hMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcih0aGlzLmRvUmVxdWVzdC5iaW5kKHRoaXMpKTtcbiAgICBza19sb2coXCJBdHRhY2hlZCBsaXN0ZW5lciBmb3IgXCIsIHRoaXMpO1xuICB9O1xuXG4gIEJhc2VDb250cm9sbGVyLnByb3RvdHlwZS5hdHRhY2hGcmFtZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKHRoaXMuZG9SZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgIHNrX2xvZyhcIkF0dGFjaGVkIGZyYW1lIGxpc3RlbmVyIGZvciBcIiwgdGhpcyk7XG4gIH07XG5cblxuICB2YXIgc2luZ2xldG9uID0gbmV3IEJhc2VDb250cm9sbGVyKCk7XG4gIG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHsgc2luZ2xldG9uLmluaXQob3B0aW9ucyk7IH1cbiAgfTtcbn0pKCk7XG4iLCI7KGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1zZywgb2JqLCBlcnIpIHtcbiAgICBvYmogPSBvYmogfHwgXCJcIjtcbiAgICBpZihlcnIpIHsgY29uc29sZS5lcnJvcihcIlNUUkVBTUtFWVMtRVJST1I6IFwiICsgbXNnLCBvYmopOyB9XG4gICAgZWxzZSB7IGNvbnNvbGUubG9nKFwiU1RSRUFNS0VZUy1JTkZPOiBcIiArIG1zZywgb2JqKTsgfVxuICB9O1xufSkoKTtcbiJdfQ==
