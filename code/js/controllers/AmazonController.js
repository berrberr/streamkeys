var controller = new BaseController();

controller.init({
  playPause: "[playeraction='togglePlay']",
  playNext: "[playeraction='next']",
  playPrev: "[playeraction='previous']",
  mute: "#volumeIcon"
});
