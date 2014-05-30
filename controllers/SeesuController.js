var controller = new BaseController();

controller.init({
  playpause: "#override",
  playnext: "#override",
  playprev: "#override"
});

controller.attach_listener(controller);

controller.playpause = function() {
  document.dispatchEvent(new CustomEvent('streamkeys-cmd', {'detail': 'playpause'}));
}
controller.playnext = function() {
  document.dispatchEvent(new CustomEvent('streamkeys-cmd', {'detail': 'next'}));
}
controller.playprev = function() {
  document.dispatchEvent(new CustomEvent('streamkeys-cmd', {'detail': 'prev'}));
}

controller.inject(chrome.extension.getURL("/contentscript/seesu_inject.js"));