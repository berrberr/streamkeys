var controller = new BaseController();

controller.init({
  playpause: "[m-player-play-button]", 
  mute: ".player-volume-percent"
});

controller.attach_listener(controller);

controller.mute = function() {
  var muteSlider = document.querySelector(this.selector_mute);
  muteSlider.style.height = (muteSlider.style.height === '0px') ? '100%': '0';
};