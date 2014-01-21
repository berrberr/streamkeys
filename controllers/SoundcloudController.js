var controller = new BaseController();

controller.init({
  playpause: ".playControl",
  playnext: ".skipControl__next",
  playprev: ".skipControl__previous",
  mute: ".volume__togglemute"
});

controller.attach_listener(controller);