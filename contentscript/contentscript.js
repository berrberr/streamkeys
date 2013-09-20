// this script relies on csCommunicator.js

function click(elementId) {
  $(elementId)[0].click();
}
communicator.on("play-pause", function(obj) {
  click("#play-pause");
});
communicator.on("play-next", function(obj) {
  click("#play-next");
});
communicator.on("play-prev", function(obj) {
  click("#play-prev");
});
communicator.on("mute", function(obj) {
  click("#volume");
});
