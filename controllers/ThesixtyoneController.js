var controller = new BaseController();

controller.init({
  playpause: "#play_button",
  play: "#play_button",
  pause: "#pause_button",
  playnext: "#large_next_song_button",
  playprev: "#large_previous_song_button"
});

controller.attach_listener(controller);