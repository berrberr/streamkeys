var controller = new BaseController();

controller.init({
  playPause: "#playButton",
  play: "#playButton",
  pause: "#stopButton",
  playStyle: "disabled",
  pauseStyle: "disabled",
  mute: ".vol-icon"
});

controller.attach_listener(controller);