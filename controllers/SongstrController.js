var controller = new BaseController();

controller.init({
  playPause: "#playing_control"
});

controller.attach_listener(controller);