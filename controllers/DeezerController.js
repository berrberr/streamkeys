var controller = new BaseController();

controller.init({
  playpause: "#player_control_play",
  play: "#player_control_play",
  pause: "#player_control_pause",
  playnext: "#player_control_next",
  playprev: "#player_control_pause"
});

controller.attach_listener(controller);