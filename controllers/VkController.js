var controller = new BaseController();
controller.selector_controlbox = "#head_music";

controller.init({
  playpause: "#head_play_btn",
  playnext: ".next.ctrl",
  playprev: ".prev.ctrl"
});

controller.attach_listener(controller);

//Must have control box open to click the next/prev controls
controller.playnext = function() {
  this.click(this.selector_controlbox);
  this.click(this.selector_playnext);
  this.click(this.selector_controlbox);
};
controller.playprev = function() {
  this.click(this.selector_controlbox);
  this.click(this.selector_playprev);
  this.click(this.selector_controlbox);
};