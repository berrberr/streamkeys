(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  "use strict";

  var sk_log = require("../modules/SKLog.js");
  document.addEventListener("streamkeys-cmd", function(e) {
    //Get seesu current song object (thanks Gleb!)
    var song = window.su.p && window.su.p.c_song;
    if(song) {
      if(e.detail === "playPause") {
        if(song.states.play) {
          try {
            song.pause();
            sk_log("playPause");
          } catch (exception) {
            sk_log("playPause", exception, true);
          }
        } else {
          try {
            song.play();
            sk_log("playPause");
          } catch (exception) {
            sk_log("playPause", exception, true);
          }
        }
      } else if(e.detail === "next") {
        try {
          song.playNext();
          sk_log("playNext");
        } catch (exception) {
          sk_log("playNext", exception, true);
        }
      } else if(e.detail === "prev") {
        try {
          song.playPrev();
          sk_log("playPrev");
        } catch (exception) {
          sk_log("playPrev", exception, true);
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
