var selectors = {
  play: "#play-pause",
  next: "#next",
  prev: "#previous"
};

this.click_in_frame = function(qs) {
  var doc = document.getElementById("app-player").contentWindow.document;
  if (!doc) return null;

  doc.querySelector(qs).click();
};

chrome.runtime.onMessage.addListener(function(request) {
  if(typeof request !== "undefined") {
    if(request.action == "play_pause") this.click_in_frame(selectors.play);
    if(request.action == "play_next") this.click_in_frame(selectors.next);
    if(request.action == "play_prev") this.click_in_frame(selectors.prev);
  }
});