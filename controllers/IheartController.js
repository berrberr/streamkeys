var controller = new BaseController();

controller.init({
  playpause: ".js-play", 
  playnext: ".js-next", 
  mute: ".js-header-volume"
});

controller.attach_listener(controller);