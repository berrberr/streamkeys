// this script relies on csCommunicator.js

var modifiers = {alt: false, ctrl: false};
var hotkeys = {play: 66, next: 86, alt: 18, ctrl: 17};

function reset_modifiers() { modifiers.alt = false; modifiers.ctrl = false; }
document.documentElement.addEventListener("keydown", function(k) {
  console.log(k.keyCode);
  if(k.keyCode == hotkeys.alt) modifiers.alt = true;
  if(k.keyCode == hotkeys.ctrl) modifiers.ctrl = true;
  if(modifiers.alt || modifiers.ctrl) {
    if(k.keyCode == hotkeys.play) {
      chrome.extension.sendMessage({action:"play-pause"});
      console.log("msg sent");
      reset_modifiers();
    }
    if(k.keyCode == hotkeys.next) console.log("NEXT");
  }

  // communicator.request(JSON.stringify({"key": k}), function(msg) {
  //   console.log(msg);
  // });
});

function click(elementId) {
  $(elementId)[0].click();
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("message recv" + request);
  if(request == "play-pause") click("#play-pause");
  if(request == "play-next") click("#play-next");
  if(request == "play-prev") click("#play-prev");
  if(request == "mute") click("#volume");
});
// communicator.on("play-pause", function(obj) {
//   click("#play-pause");
// });
// communicator.on("play-next", function(obj) {
//   click("#play-next");
// });
// communicator.on("play-prev", function(obj) {
//   click("#play-prev");
// });
// communicator.on("mute", function(obj) {
//   click("#volume");
// });
