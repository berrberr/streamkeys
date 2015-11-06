(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  "use strict";

  var sk_log = require("../modules/SKLog.js"),
      player = window.sublime.player("laracasts-video"),
      _skPlayerState = "paused";

  player.on("start", function() {
    _skPlayerState = "playing";
    sk_log(_skPlayerState);
  });
  player.on("play", function() {
    _skPlayerState = "playing";
    sk_log(_skPlayerState);
  });
  player.on("pause", function() {
    _skPlayerState = "paused";
    sk_log(_skPlayerState);
  });

  document.addEventListener("streamkeys-cmd", function(e) {
    if(player && e.detail === "playPause") {
      if(_skPlayerState === "paused") {
        try {
          player.play();
          sk_log("playPause");
        } catch (exception) {
          sk_log("playPause", exception, true);
        }
      } else {
        try {
          player.pause();
          sk_log("playPause");
        } catch (exception) {
          sk_log("playPause", exception, true);
        }
      }
    }
  });

})();

},{"../modules/SKLog.js":2}],2:[function(require,module,exports){
;(function() {
  "use strict";

  /**
   * Log messages to console with prepended message. Also dispatches a JS event
   * to interact with tests
   * @param msg {String} message to log
   * @param [obj] {Object} object to dump with message
   * @param [err] {Boolean} TRUE if the message is an error
   */
  module.exports = function(msg, obj, err) {
    if(msg) {
      obj = obj || "";
      if(err) {
        console.error("STREAMKEYS-ERROR: " + msg, obj);
        msg = "ERROR: " + msg;
      } else {
        console.log("STREAMKEYS-INFO: " + msg, obj);
      }

      document.dispatchEvent(new CustomEvent("streamkeys-test-response", {detail: msg}));
    }
  };
})();

},{}]},{},[1]);
