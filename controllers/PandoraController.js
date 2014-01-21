var controller = new BaseController();

controller.init({
  playpause: ".playButton",
  play: ".playButton",
  pause: ".pauseButton",
  playnext: ".skipButton"
});

controller.attach_listener(controller);