var controller = new BaseController();

controller.init({
  playPause: "#btn-playPause",
  playNext: "#btn-ff",
  mute: "#player_volume_icon"
});

controller.attach_listener(controller);