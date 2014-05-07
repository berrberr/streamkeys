var controller = new BaseController();

controller.init({
  playpause: ".btn-playpause",
  playnext: ".btn-skip",
  playprev: ".btn-rewind",
  mute: ".btn-volume"
});

controller.attach_listener(controller);