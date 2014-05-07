var controller = new BaseController();

controller.init({
  playpause: ".miniplayer-control-play-pause",
  playnext: ".miniplayer-control-skip",
  mute: ".miniplayer-volume-icon"
});

controller.attach_listener(controller);