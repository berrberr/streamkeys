var controller = new BaseController();

controller.init({
  playPause: "[data-id=play-pause]",
  playNext: "[data-id=forward]",
  playPrev: "[data-id=rewind]"
});

controller.attach_listener(controller);