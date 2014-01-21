var controller = new BaseController();

controller.init({
  playpause: "#playerPlay",
  playnext: "#playerNext",
  playprev: "#playerPrev",
  mute: "#player-volume-mute"
});

controller.attach_listener(controller);