var controller = new BaseController();

controller.init({
  playPause: ".play",
  playNext: ".next",
  playPrev: ".previous",
  mute: "#volumeBtn"
});

controller.attach_listener(controller);