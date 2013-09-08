// this script relies on csCommunicator.js

function click(elementId) {
  $(elementId)[0].click();
}

communicator.on("play-pause", function(obj) {
  console.log("play-pause pressed");
  click("#play-pause");
});
communicator.on("play-next", function(obj) {
  console.log("play-next pressed");
  click("#play-next");
});
communicator.on("play-prev", function(obj) {
  console.log("play-prev pressed");
  click("#play-prev");
});
communicator.on("mute", function(obj) {
  console.log("mute pressed");
  click("#volume");
});

// communicator.on('iconClicked', function(obj) {
//   console.log('Icon was clicked. Received following data:', obj);
//   // confirm that the data was received (send a 'request' to the background)
//   communicator.request('confirm', { received: true });
// });
