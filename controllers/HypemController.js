var controller = new BaseController();

controller.init({
  playPause: "#playerPlay",
  playNext: "#playerNext",
  playPrev: "#playerPrev",
  mute: "#player-volume-mute"
});

controller.attach_listener(controller);