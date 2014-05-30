(function() {
  if(window.sk_log) return;

  window.sk_log = function(msg, obj, err) {
    obj = obj || "";
    if(err) { console.error("STREAMKEYS - ERROR: " + msg, obj); }
    else { console.log("STREAMKEYS - INFO: " + msg, obj); }
  };
})();

var BaseController = function() {
  this.name = document.location.hostname;

  //** Properties **//
  this.selector_playpause = null;
  this.selector_play = null;
  this.selector_pause = null;
  this.selector_playnext = null;
  this.selector_playprev = null;
  this.selector_mute = null;

  this.playing = false;
  this.isInline = false;

};

BaseController.prototype.init = function(selectors) {
  this.selector_playpause = selectors.playpause || null;
  this.selector_play = selectors.play || null;
  this.selector_pause = selectors.pause || null;
  this.selector_playnext = selectors.playnext || null;
  this.selector_playprev = selectors.playprev || null;
  this.selector_mute = selectors.mute || null;

  if(selectors.inline_playpause) {
    this.selector_inline_playpause = selectors.inline_playpause || null;
    this.selector_inline_playnext = selectors.inline_playnext || null;
    this.selector_inline_playprev = selectors.inline_playprev || null;
    this.selector_inline_mute = selectors.inline_mute || null;

    //If the inline element is found then assume the player is inline
    if(document.querySelector(selectors.inline_playpause)) {
      this.isInline = true;
    }
  }

  chrome.runtime.sendMessage({created: true}, function(response){
    sk_log("Told BG we are created");
  });

  sk_log("SK content script loaded ...");
};

BaseController.prototype.inject = function(file) {
  var script = document.createElement("script");
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file);
  document.getElementsByTagName("body")[0].appendChild(script);
};

BaseController.prototype.is_playing = function() {
  //hack to get around sometimes not being able to read css properties that are not inline
  var elem = document.querySelector(this.selector_play);
  var displayStyle = "none";
  if (elem.currentStyle) {
    displayStyle = elem.currentStyle.display;
  } else if (window.getComputedStyle) {
    displayStyle = window.getComputedStyle(elem, null).getPropertyValue("display");
  }

  sk_log("IsPlaying: ", (displayStyle == "none"));
  return (displayStyle == "none");
};

BaseController.prototype.click = function(query_selector) {
  var ele = document.querySelector(query_selector)
  if(ele) {
    ele.click();
  } else {
    sk_log('Element not found for click.', ele, true);
  }
};

BaseController.prototype.playpause = function() {
  if(this.isInline) {
    this.click(this.selector_inline_playpause);
  } else {
    if(this.selector_play !== null && this.selector_pause !== null) {
      if(this.is_playing()) {
        this.click(this.selector_pause);
      } else {
        this.click(this.selector_play);
      }
    } else {
      this.click(this.selector_playpause);
    }
  }
};

BaseController.prototype.playnext = function() {
  this.click(this.selector_playnext);
};

BaseController.prototype.playprev = function() {
  this.click(this.selector_playprev);
};

BaseController.prototype.mute = function() {
  if(typeof this.selector_mute !== "undefined") this.click(this.selector_mute);
};

BaseController.prototype.do_request = function(request, sender, sendResponse) {
  if(typeof request !== "undefined") {
    if(request.action == "play_pause") this.playpause();
    if(request.action == "play_next") this.playnext();
    if(request.action == "play_prev") this.playprev();
    if(request.action == "mute") this.mute();
  }
};

BaseController.prototype.attach_listener = function() {
  chrome.runtime.onMessage.addListener(this.do_request.bind(this));
  sk_log('Attached listener for ', this);
};
