var controller = new BaseController();

controller.init({
  playpause: "#play-pause",
  playnext: "#play-next",
  playprev: "#play-prev",
  mute: "#volume"
});

controller.attach_listener(controller);