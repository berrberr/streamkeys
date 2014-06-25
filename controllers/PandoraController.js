var controller = new BaseController();

controller.init({
  playPause: ".playButton",
  play: ".playButton",
  pause: ".pauseButton",
  playNext: ".skipButton"
});

controller.attach_listener(controller);