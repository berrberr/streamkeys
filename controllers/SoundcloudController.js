var controller = new BaseController();

controller.init({
  playpause: ".playControl",
  playnext: ".skipControl__next",
  playprev: ".skipControl__previous",
  mute: ".volume__togglemute",

  inline_playpause: ".playButton"
});

controller.attach_listener(controller);