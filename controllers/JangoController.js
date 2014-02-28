var controller = new BaseController();

controller.init({
  playpause: "#btn-playpause",
  playnext: "#btn-ff",
  mute: "#player_volume_icon"
});

controller.attach_listener(controller);