var controller = new BaseController();

controller.init({
  playpause: ".play_pause",
  playnext: ".next",
  playprev: ".prev",
  mute: ".Volume"
});

controller.attach_listener(controller);