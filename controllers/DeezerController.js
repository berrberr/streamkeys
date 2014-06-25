var controller = new BaseController();

controller.init({
  playPause: "#player_control_play",
  play: "#player_control_play",
  pause: "#player_control_pause",
  playNext: "#player_control_next",
  playPrev: "#player_control_prev",
  mute: "#player_volume_0"
});

controller.attach_listener(controller);