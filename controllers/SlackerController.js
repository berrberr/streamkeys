var controller = new BaseController();

controller.init({
  playPause: "#playerPlayPauseButton",
  playNext: "#playerSkipButton",
  playPrev: "#playerSkipBackButton"
});

controller.attach_listener(controller);