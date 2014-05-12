var controller = new BaseController();

controller.init({
  playpause: "#audio_player-play",
  playnext: "#audio_player-skip",
  mute: "#audio_player-volume"
});

controller.attach_listener(controller);