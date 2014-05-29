var controller = new BaseController();

controller.init({
  playpause: "#override",
  playnext: "#override",
  playprev: "#override"
});

controller.attach_listener(controller);

// var currentSong = window.su.p && window.su.p.c_song;
// if (currentSong) {
//   currentSong.playNext();
//   currentSong.playPrev();
//   currentSong.pause();
//   currentSong.play();
// }

controller.getCurrentSong = function() {
  return window.su.p && window.su.p.c_song;
}
controller.playpause = function() {
  //var currentSong = window.su.p && window.su.p.c_song;
  if(this.getCurrentSong()) this.getCurrentSong().play()
}
controller.playnext = function() {
  if(this.getCurrentSong()) this.getCurrentSong().playNext()
}
controller.playprev = function() {
  if(this.getCurrentSong()) this.getCurrentSong().playPrev()
}

controller.inject(chrome.extension.getURL("/controllers/SeesuController.js"));