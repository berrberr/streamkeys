(function() {

  document.addEventListener('streamkeys-cmd', function(e) {
    //Get seesu current song object (thanks Gleb!)
    var song = window.su.p && window.su.p.c_song;
    if(song) {
      if(e.detail === 'playpause') {
        if(song.states.play) {
          song.pause() 
        } else { 
          song.play();
        }
      } else if(e.detail === 'next') {
        song.playNext();
      } else if(e.detail === 'prev') {
        song.playPrev();
      }
    }
  });

})();