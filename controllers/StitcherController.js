var controller = new BaseController();

controller.init({
  playPause: "#audio_player-play",
  playNext: "#audio_player-skip",
  mute: "#audio_player-volume"
});

controller.attach_listener(controller);