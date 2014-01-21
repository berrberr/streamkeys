var controller = new BaseController();

controller.init({
  playpause: "[data-id=play-pause]",
  playnext: "[data-id=forward]",
  playprev: "[data-id=rewind]"
});

controller.attach_listener(controller);