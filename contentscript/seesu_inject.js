(function() {

  document.addEventListener('streamkeys-cmd', function(e) {
    //Get seesu current song object (thanks Gleb!)
    var song = window.su.p && window.su.p.c_song;
    if(song) {
      if(e.detail === 'playPause') {
        if(song.states.play) {
          try {
            song.pause();
            sk_log("playPause");
          } catch (e) {
            sk_log("playPause", {}, true);
          }
        } else {
          try {
            song.play();
            sk_log("playPause");
          } catch (e) {
            sk_log("playPause", {}, true);
          }
        }
      } else if(e.detail === 'next') {
        try {
          song.playNext();
          sk_log("playNext");
        } catch (e) {
          sk_log("playNext", {}, true);
        }
      } else if(e.detail === 'prev') {
        try{
          song.playPrev();
          sk_log("playPrev"); 
        } catch (e) {
          sk_log("playPrev", {}, true);
        }
      }
    }
  });

})();