var controller = new BaseController({
  selector_playpause: "#play-pause",
  selector_playnext: "#play-next",
  selector_playprev: "#play-prev",
  selector_mute: "#volume"
});

controller.init("#play-pause", "#play-next", "#play-prev", "#volume");

controller.inject();

controller.attach_listener(controller);