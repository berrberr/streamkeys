var BaseController = function() {
  this.name = document.location.hostname;

  //** Properties **//
  this.selector_playpause = null;
  this.selector_playnext = null;
  this.selector_playprev = null;
  this.selector_mute = null;

  this.playing = false;
};

BaseController.prototype.click = function(query_selector) {
  document.querySelector(query_selector).click();
};

BaseController.prototype.playpause = function() {
  this.playing = !this.playing;
  this.click(this.selector_playpause);
};

BaseController.prototype.playnext = function() {
  this.click(this.selector_playnext);
};

BaseController.prototype.playprev = function() {
  this.click(this.selector_playprev);
};