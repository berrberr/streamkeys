var controller = new BaseController();

controller.init({
  playpause: "#player_play_button",
  play: "#player_play_button",
  pause: "#player_pause_button",
  playnext: "#player_skip_button",
  mute: ".volume_mute"
});

controller.attach_listener(controller);