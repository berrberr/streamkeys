"use strict";
(function() {
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
