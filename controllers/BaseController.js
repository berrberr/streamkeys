var BaseController = function() {
  this.name = document.location.hostname;

  //** Properties **//
  this.selector_playpause = null;
  this.selector_playnext = null;
  this.selector_playprev = null;
  this.selector_mute = null;

  this.playing = false;

};

BaseController.prototype.init = function(playpause, playnext, playprev, mute) {
  this.selector_playpause = playpause || null;
  this.selector_playnext = playnext || null;
  this.selector_playprev = playprev || null;
  this.selector_mute = mute || null;
};

BaseController.prototype.inject = function() {
  var script = document.createElement("script");
  script.textContent = "window._basecontroller = " + (this) + ";";
  document.head.appendChild(script);
}

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

BaseController.prototype.do_request = function(request, sender, sendResponse) {
  console.log("BASE CONTROLLER MSG: ", request);
  console.log("BASE CONTROLLER SCOPE: ", this);
  if(typeof request !== "undefined") {
    if(request.action == "play_pause") this.playpause();
    if(request.action == "play_next") this.playnext();
    if(request.action ==  "play-prev") this.playprev();
  }
};

BaseController.prototype.attach_listener = function() {
  chrome.runtime.onMessage.addListener(this.do_request.bind(this));
  console.log("SCOPE: ", this);
};
