var controller = new BaseController();

controller.init({
  playPause: "#player_play_button",
  play: "#player_play_button",
  pause: "#player_pause_button",
  playNext: "#player_skip_button",
  mute: ".volume_mute"
});

controller.attach_listener(controller);