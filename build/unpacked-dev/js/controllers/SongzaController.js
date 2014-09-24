(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: ".miniplayer-control-play-pause",
    playNext: ".miniplayer-control-skip",
    mute: ".miniplayer-volume-icon"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGV4Zy9Eb2N1bWVudHMvc2NyaXB0cy9zdHJlYW1rZXlzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleGcvRG9jdW1lbnRzL3NjcmlwdHMvc3RyZWFta2V5cy9jb2RlL2pzL2NvbnRyb2xsZXJzL1Nvbmd6YUNvbnRyb2xsZXIuanMiLCIvVXNlcnMvYWxleGcvRG9jdW1lbnRzL3NjcmlwdHMvc3RyZWFta2V5cy9jb2RlL2pzL21vZHVsZXMvQmFzZUNvbnRyb2xsZXIuanMiLCIvVXNlcnMvYWxleGcvRG9jdW1lbnRzL3NjcmlwdHMvc3RyZWFta2V5cy9jb2RlL2pzL21vZHVsZXMvc2tfbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgcmVxdWlyZShcIi4uL21vZHVsZXMvQmFzZUNvbnRyb2xsZXIuanNcIikuaW5pdCh7XG4gICAgcGxheVBhdXNlOiBcIi5taW5pcGxheWVyLWNvbnRyb2wtcGxheS1wYXVzZVwiLFxuICAgIHBsYXlOZXh0OiBcIi5taW5pcGxheWVyLWNvbnRyb2wtc2tpcFwiLFxuICAgIG11dGU6IFwiLm1pbmlwbGF5ZXItdm9sdW1lLWljb25cIlxuICB9KTtcbn0pKCk7XG4iLCI7KGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgQmFzZUNvbnRyb2xsZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH07XG4gIHZhciBza19sb2cgPSByZXF1aXJlKFwiLi4vbW9kdWxlcy9za19sb2cuanNcIik7XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5uYW1lID0gZG9jdW1lbnQubG9jYXRpb24uaG9zdG5hbWU7XG5cbiAgICAvLyoqIEluamVjdCBjb25zb2xlIGxvZyBmb3JtYXR0ZXIgKiovL1xuXG4gICAgLy8qKiBQcm9wZXJ0aWVzICoqLy9cbiAgICB0aGlzLnNlbGVjdG9yX3BsYXlQYXVzZSA9IG9wdGlvbnMucGxheVBhdXNlIHx8IG51bGw7XG4gICAgdGhpcy5zZWxlY3Rvcl9wbGF5ID0gb3B0aW9ucy5wbGF5IHx8IG51bGw7XG4gICAgdGhpcy5zZWxlY3Rvcl9wYXVzZSA9IG9wdGlvbnMucGF1c2UgfHwgbnVsbDtcbiAgICB0aGlzLnNlbGVjdG9yX3BsYXlOZXh0ID0gb3B0aW9ucy5wbGF5TmV4dCB8fCBudWxsO1xuICAgIHRoaXMuc2VsZWN0b3JfcGxheVByZXYgPSBvcHRpb25zLnBsYXlQcmV2IHx8IG51bGw7XG4gICAgdGhpcy5zZWxlY3Rvcl9tdXRlID0gb3B0aW9ucy5tdXRlIHx8IG51bGw7XG4gICAgdGhpcy5zZWxlY3Rvcl9pZnJhbWUgPSBvcHRpb25zLmlmcmFtZSB8fCBudWxsO1xuXG4gICAgLy9PcHRpb25hbC4gU3R5bGUgb2YgcGxheSBhbmQgcGF1c2UgYnV0dG9ucyB3aGVuIHRoZXkgYXJlIE5PVCBpbiB1c2VcbiAgICAvL0VYOiBXaGVuIGEgcGxheSBidXR0b24gaXMgaW4gdXNlLCBjc3MgY2xhc3MgXCJwbGF5aW5nXCIgaXMgYWRkZWRcbiAgICAvL0luIHRoYXQgY2FzZSwgc2V0IHBsYXlTdHlsZSB0byBcInBsYXlpbmdcIlxuICAgIHRoaXMucGxheVN0eWxlID0gb3B0aW9ucy5wbGF5U3R5bGUgfHwgbnVsbDtcbiAgICB0aGlzLnBhdXNlU3R5bGUgPSBvcHRpb25zLnBhdXNlU3R5bGUgfHwgbnVsbDtcblxuICAgIHRoaXMuaWZyYW1lID0gKHR5cGVvZiBvcHRpb25zLmlmcmFtZSA9PT0gXCJzdHJpbmdcIik7XG5cbiAgICAvL1NldCB0byB0cnVlIGlmIHRoZSBwbGF5L3BhdXNlIGJ1dHRvbnMgc2hhcmUgdGhlIHNhbWUgZWxlbWVudFxuICAgIHRoaXMuYnV0dG9uU3dpdGNoID0gb3B0aW9ucy5idXR0b25Td2l0Y2ggfHwgZmFsc2U7XG5cbiAgICAvL0RlZmF1bHQgbGlzdGVuZXIgc2VuZHMgYWN0aW9ucyB0byBtYWluIGRvY3VtZW50XG4gICAgaWYodGhpcy5pZnJhbWUpIHtcbiAgICAgIHRoaXMuYXR0YWNoRnJhbWVMaXN0ZW5lcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmF0dGFjaExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2NyZWF0ZWQ6IHRydWV9LCBmdW5jdGlvbigpIHtcbiAgICAgIHNrX2xvZyhcIlRvbGQgQkcgd2UgYXJlIGNyZWF0ZWRcIik7XG4gICAgfSk7XG5cbiAgICBza19sb2coXCJTSyBjb250ZW50IHNjcmlwdCBsb2FkZWRcIik7XG4gIH07XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmluamVjdFNjcmlwdCA9IGZ1bmN0aW9uKGZpbGUpIHtcbiAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvamF2YXNjcmlwdFwiKTtcbiAgICBpZihmaWxlLnVybCkge3NjcmlwdC5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgY2hyb21lLmV4dGVuc2lvbi5nZXRVUkwoZmlsZS51cmwpKTt9XG4gICAgaWYoZmlsZS5zY3JpcHQpIHtzY3JpcHQuaW5uZXJIVE1MID0gZmlsZS5zY3JpcHQ7fVxuICAgIChkb2N1bWVudC5oZWFkfHxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gIH07XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmlzUGxheWluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2VsZWN0b3JfcGxheSksXG4gICAgICAgIGRpc3BsYXlTdHlsZSA9IFwibm9uZVwiLFxuICAgICAgICBpc1BsYXlpbmcgPSBmYWxzZTtcblxuICAgIGlmKHRoaXMuYnV0dG9uU3dpdGNoKSB7XG4gICAgICAvL0lmIHBsYXlFbCBkb2VzIG5vdCBleGlzdCB0aGVuIGl0IGlzIGN1cnJlbnRseSBwbGF5aW5nXG4gICAgICBpc1BsYXlpbmcgPSAocGxheUVsID09PSBudWxsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9DaGVjayBmb3IgcGxheS9wYXVzZSBzdHlsZSBvdmVycmlkZXNcbiAgICAgIGlmKHRoaXMucGxheVN0eWxlICYmIHRoaXMucGF1c2VTdHlsZSkge1xuICAgICAgICAvL0NoZWNrIGlmIHRoZSBjbGFzcyBsaXN0IGNvbnRhaW5zIHRoZSBjbGFzcyB0aGF0IGlzIG9ubHkgYWN0aXZlIHdoZW4gcGxheSBidXR0b24gaXMgcGxheWluZ1xuICAgICAgICBpc1BsYXlpbmcgPSBwbGF5RWwuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMucGxheVN0eWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vaGFjayB0byBnZXQgYXJvdW5kIHNvbWV0aW1lcyBub3QgYmVpbmcgYWJsZSB0byByZWFkIGNzcyBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBpbmxpbmVcbiAgICAgICAgaWYgKHBsYXlFbC5jdXJyZW50U3R5bGUpIHtcbiAgICAgICAgICBkaXNwbGF5U3R5bGUgPSBwbGF5RWwuY3VycmVudFN0eWxlLmRpc3BsYXk7XG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICBkaXNwbGF5U3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwbGF5RWwsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJkaXNwbGF5XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlzUGxheWluZyA9IChkaXNwbGF5U3R5bGUgPT0gXCJub25lXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNrX2xvZyhcIklzUGxheWluZzogXCIgKyBpc1BsYXlpbmcpO1xuICAgIHJldHVybiBpc1BsYXlpbmc7XG4gIH07XG5cbiAgLy8qKiBDbGljayBpbnNpZGUgZG9jdW1lbnQgKiovL1xuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUuY2xpY2sgPSBmdW5jdGlvbihzZWxlY3RvckJ1dHRvbiwgYWN0aW9uKSB7XG4gICAgdmFyIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JCdXR0b24pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGVsZS5jbGljaygpO1xuICAgICAgc2tfbG9nKGFjdGlvbik7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBza19sb2coXCJFbGVtZW50IG5vdCBmb3VuZCBmb3IgY2xpY2suXCIsIHNlbGVjdG9yQnV0dG9uLCB0cnVlKTtcbiAgICB9XG4gIH07XG5cbiAgLy8qKiBDbGljayBpbnNpZGUgYW4gaWZyYW1lICoqLy9cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmNsaWNrSW5GcmFtZSA9IGZ1bmN0aW9uKHNlbGVjdG9yRnJhbWUsIHNlbGVjdG9yQnV0dG9uLCBhY3Rpb24pIHtcbiAgICB2YXIgZG9jID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvckZyYW1lKS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICAgIGlmICghZG9jKSByZXR1cm4gbnVsbDtcblxuICAgIHRyeSB7XG4gICAgICBkb2MucXVlcnlTZWxlY3RvcihzZWxlY3RvckJ1dHRvbikuY2xpY2soKTtcbiAgICAgIHNrX2xvZyhhY3Rpb24pO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgc2tfbG9nKFwiRWxlbWVudCBub3QgZm91bmQgZm9yIGNsaWNrLlwiLCBzZWxlY3RvckJ1dHRvbiwgdHJ1ZSk7XG4gICAgfVxuICB9O1xuXG4gIC8vVE9ETzogbWFrZSBpc1BsYXlpbmcgd29yayB3aXRoIGlmcmFtZXNcbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLnBsYXlQYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuc2VsZWN0b3JfcGxheSAhPT0gbnVsbCAmJiB0aGlzLnNlbGVjdG9yX3BhdXNlICE9PSBudWxsKSB7XG4gICAgICBpZih0aGlzLmlzUGxheWluZygpKSB7XG4gICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wYXVzZSwgXCJwbGF5UGF1c2VcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfcGxheSwgXCJwbGF5UGF1c2VcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuaWZyYW1lKSB0aGlzLmNsaWNrSW5GcmFtZSh0aGlzLnNlbGVjdG9yX2lmcmFtZSwgdGhpcy5zZWxlY3Rvcl9wbGF5UGF1c2UsIFwicGxheVBhdXNlXCIpO1xuICAgICAgZWxzZSAgICAgICAgICAgIHRoaXMuY2xpY2sodGhpcy5zZWxlY3Rvcl9wbGF5UGF1c2UsIFwicGxheVBhdXNlXCIpO1xuICAgIH1cbiAgfTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUucGxheU5leHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnNlbGVjdG9yX3BsYXlOZXh0KSB7XG4gICAgICBpZih0aGlzLmlmcmFtZSkgdGhpcy5jbGlja0luRnJhbWUodGhpcy5zZWxlY3Rvcl9pZnJhbWUsIHRoaXMuc2VsZWN0b3JfcGxheU5leHQsIFwicGxheU5leHRcIik7XG4gICAgICBlbHNlICAgICAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXlOZXh0LCBcInBsYXlOZXh0XCIpO1xuICAgIH1cbiAgfTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUucGxheVByZXYgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLnNlbGVjdG9yX3BsYXlQcmV2KSB7XG4gICAgICBpZih0aGlzLmlmcmFtZSkgdGhpcy5jbGlja0luRnJhbWUodGhpcy5zZWxlY3Rvcl9pZnJhbWUsIHRoaXMuc2VsZWN0b3JfcGxheVByZXYsIFwicGxheVByZXZcIik7XG4gICAgICBlbHNlICAgICAgICAgICAgdGhpcy5jbGljayh0aGlzLnNlbGVjdG9yX3BsYXlQcmV2LCBcInBsYXlQcmV2XCIpO1xuICAgIH1cbiAgfTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUubXV0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuc2VsZWN0b3JfbXV0ZSkge1xuICAgICAgaWYodGhpcy5pZnJhbWUpIHRoaXMuY2xpY2tJbkZyYW1lKHRoaXMuc2VsZWN0b3JfaWZyYW1lLCB0aGlzLnNlbGVjdG9yX211dGUsIFwibXV0ZVwiKTtcbiAgICAgIGVsc2UgICAgICAgICAgICB0aGlzLmNsaWNrKHRoaXMuc2VsZWN0b3JfbXV0ZSwgXCJtdXRlXCIpO1xuICAgIH1cbiAgfTtcblxuICBCYXNlQ29udHJvbGxlci5wcm90b3R5cGUuZG9SZXF1ZXN0ID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgIGlmKHR5cGVvZiByZXF1ZXN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZihyZXF1ZXN0LmFjdGlvbiA9PSBcInBsYXlfcGF1c2VcIikgdGhpcy5wbGF5UGF1c2UoKTtcbiAgICAgIGlmKHJlcXVlc3QuYWN0aW9uID09IFwicGxheV9uZXh0XCIpIHRoaXMucGxheU5leHQoKTtcbiAgICAgIGlmKHJlcXVlc3QuYWN0aW9uID09IFwicGxheV9wcmV2XCIpIHRoaXMucGxheVByZXYoKTtcbiAgICAgIGlmKHJlcXVlc3QuYWN0aW9uID09IFwibXV0ZVwiKSB0aGlzLm11dGUoKTtcbiAgICB9XG4gIH07XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmF0dGFjaExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKHRoaXMuZG9SZXF1ZXN0LmJpbmQodGhpcykpO1xuICAgIHNrX2xvZyhcIkF0dGFjaGVkIGxpc3RlbmVyIGZvciBcIiwgdGhpcyk7XG4gIH07XG5cbiAgQmFzZUNvbnRyb2xsZXIucHJvdG90eXBlLmF0dGFjaEZyYW1lTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIodGhpcy5kb1JlcXVlc3QuYmluZCh0aGlzKSk7XG4gICAgc2tfbG9nKFwiQXR0YWNoZWQgZnJhbWUgbGlzdGVuZXIgZm9yIFwiLCB0aGlzKTtcbiAgfTtcblxuXG4gIHZhciBzaW5nbGV0b24gPSBuZXcgQmFzZUNvbnRyb2xsZXIoKTtcbiAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9ucykgeyBzaW5nbGV0b24uaW5pdChvcHRpb25zKTsgfVxuICB9O1xufSkoKTtcbiIsIjsoZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obXNnLCBvYmosIGVycikge1xuICAgIG9iaiA9IG9iaiB8fCBcIlwiO1xuICAgIGlmKGVycikgeyBjb25zb2xlLmVycm9yKFwiU1RSRUFNS0VZUy1FUlJPUjogXCIgKyBtc2csIG9iaik7IH1cbiAgICBlbHNlIHsgY29uc29sZS5sb2coXCJTVFJFQU1LRVlTLUlORk86IFwiICsgbXNnLCBvYmopOyB9XG4gIH07XG59KSgpO1xuIl19
