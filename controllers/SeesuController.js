var controller = new BaseController();

controller.init({
  playPause: "#override",
  playNext: "#override",
  playPrev: "#override"
});

controller.attach_listener(controller);

controller.playPause = function() {
  document.dispatchEvent(new CustomEvent('streamkeys-cmd', {'detail': 'playPause'}));
}
controller.playNext = function() {
  document.dispatchEvent(new CustomEvent('streamkeys-cmd', {'detail': 'next'}));
}
controller.playPrev = function() {
  document.dispatchEvent(new CustomEvent('streamkeys-cmd', {'detail': 'prev'}));
}

controller.inject_script({url: "/contentscript/seesu_inject.js"});