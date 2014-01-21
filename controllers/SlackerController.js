var controller = new BaseController();

controller.init({
  playpause: "#playerPlayPauseButton",
  playnext: "#playerSkipButton",
  playprev: "#playerSkipBackButton"
});

controller.attach_listener(controller);