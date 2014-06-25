function sk_log(msg, obj, err) {
  obj = obj || "";
  if(err) { console.error("STREAMKEYS-ERROR: " + msg, obj); }
  else { console.log("STREAMKEYS-INFO: " + msg, obj); }
};

var BaseController = function() {
  this.name = document.location.hostname;
};

BaseController.prototype.init = function(selectors) {

  //** Inject console log formatter **//
  this.inject_script({script: sk_log});
  this.inject_test_communicator();

  //** Properties **//
  this.selector_playPause = selectors.playPause || null;
  this.selector_play = selectors.play || null;
  this.selector_pause = selectors.pause || null;
  this.selector_playNext = selectors.playNext || null;
  this.selector_playPrev = selectors.playPrev || null;
  this.selector_mute = selectors.mute || null;

  //Optional. Style of play and pause buttons when they are NOT in use
  //EX: When a play button is in use, css class "playing" is added
  //In that case, set play_style to "playing"
  this.play_style = selectors.playStyle || null;
  this.pause_style = selectors.pauseStyle || null;

  chrome.runtime.sendMessage({created: true}, function(response){
    sk_log("Told BG we are created");
  });

  sk_log("SK content script loaded");
  // chrome.runtime.sendMessage({action: "get_commands"}, function(resp) {
  //   window.sk_log(JSON.stringify(resp));
  // });
};

BaseController.prototype.inject_script = function(file) {
  var script = document.createElement("script");
  script.setAttribute('type', 'text/javascript');
  if(file.url) {script.setAttribute('src', chrome.extension.getURL(file.url));}
  if(file.script) {script.innerHTML = file.script;}
  (document.head||document.documentElement).appendChild(script);
}

BaseController.prototype.inject_test_communicator = function() {
  var self = this;
  document.addEventListener('streamkeys-test', function(e){
    if(e.detail) {
      if(e.detail == "playPause") self.playPause();
      if(e.detail == "playNext") self.playNext();
      if(e.detail == "playPrev") self.playPrev();
      if(e.detail == "mute") self.mute();
    }
  });
};

BaseController.prototype.is_playing = function() {
  var elem = document.querySelector(this.selector_play);
  var displayStyle = "none";
  var isPlaying = false;

  //Check for play/pause style overrides
  if(this.play_style && this.pause_style) {
    //Check if the class list contains the class that is only active when play button is playing
    isPlaying = elem.classList.contains(this.play_style);
  } else {
    //hack to get around sometimes not being able to read css properties that are not inline
    if (elem.currentStyle) {
      displayStyle = elem.currentStyle.display;
    } else if (window.getComputedStyle) {
      displayStyle = window.getComputedStyle(elem, null).getPropertyValue("display");
    }
    isPlaying = (displayStyle == "none");
  }

  sk_log("IsPlaying: " + isPlaying);
  return isPlaying;
};

BaseController.prototype.click = function(query_selector, action) {
  var ele = document.querySelector(query_selector)
  try {
    ele.click();
    sk_log(action);
  } catch(e) {
    sk_log("Element not found for click.", ele, true);
  }
};

BaseController.prototype.playPause = function() {
  if(this.selector_play !== null && this.selector_pause !== null) {
    if(this.is_playing()) {
      this.click(this.selector_pause, "playPause");
    } else {
      this.click(this.selector_play, "playPause");
    }
  } else {
    this.click(this.selector_playPause, "playPause");
  }
};

BaseController.prototype.playNext = function() {
  if(this.selector_playNext) this.click(this.selector_playNext, "playNext");
};

BaseController.prototype.playPrev = function() {
  if(this.selector_playPrev) this.click(this.selector_playPrev, "playPrev");
};

BaseController.prototype.mute = function() {
  if(this.selector_mute) this.click(this.selector_mute, "mute");
};

BaseController.prototype.do_request = function(request, sender, sendResponse) {
  if(typeof request !== "undefined") {
    if(request.action == "play_pause") this.playPause();
    if(request.action == "play_next") this.playNext();
    if(request.action == "play_prev") this.playPrev();
    if(request.action == "mute") this.mute();
  }
};

BaseController.prototype.attach_listener = function() {
  chrome.runtime.onMessage.addListener(this.do_request.bind(this));
  sk_log('Attached listener for ', this);
};
