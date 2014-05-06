var controller = new BaseController();

controller.init({
  playpause: "#play-pause",
  playnext: "#next",
  playprev: "#previous"
});

controller.attach_listener(controller);