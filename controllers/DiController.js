var controller = new BaseController();

controller.init({
  playPause: "#ctl-play",
  mute: "#btn-volume"
});

controller.attach_listener(controller);