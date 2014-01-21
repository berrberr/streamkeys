var controller = new BaseController();

controller.init({
  playpause: ".play",
  playnext: ".next",
  playprev: ".previous",
  mute: "#volumeBtn"
});

controller.attach_listener(controller);