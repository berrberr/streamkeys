var controller = new BaseController();
controller.selector_controlbox = "#head_music";

controller.init({
  playPause: "#head_play_btn",
  playNext: ".next.ctrl",
  playPrev: ".prev.ctrl"
});

//Must have control box open to click the next/prev controls
controller.playNext = function() {
  this.click(this.selector_controlbox);
  this.click(this.selector_playNext);
  this.click(this.selector_controlbox);
};
controller.playPrev = function() {
  this.click(this.selector_controlbox);
  this.click(this.selector_playPrev);
  this.click(this.selector_controlbox);
};
