(function() {

  "use strict";

  document.addEventListener("streamkeys-cmd", function(e) {
    //Get seesu current song object (thanks Gleb!)
    var song = window.su.p && window.su.p.c_song;
    if(song) {
      if(e.detail === "playPause") {
        if(song.states.play) {
          try {
            song.pause();
            window.sk_log("playPause");
          } catch (e) {
            window.sk_log("playPause", {}, true);
          }
        } else {
          try {
            song.play();
            window.sk_log("playPause");
          } catch (e) {
            window.sk_log("playPause", {}, true);
          }
        }
      } else if(e.detail === "next") {
        try {
          song.playNext();
          window.sk_log("playNext");
        } catch (e) {
          window.sk_log("playNext", {}, true);
        }
      } else if(e.detail === "prev") {
        try{
          song.playPrev();
          window.sk_log("playPrev");
        } catch (e) {
          window.sk_log("playPrev", {}, true);
        }
      }
    }
  });

})();
