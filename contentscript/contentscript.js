// this script relies on csCommunicator.js

function click(elementId) {
  $(elementId)[0].click();
};

communicator.on('play-pause', function(obj) {
  console.log("play-pause pressed");
  click("#play-pause");
  console.log("click sent");
});


communicator.on('iconClicked', function(obj) {
  console.log('Icon was clicked. Received following data:', obj);

  // confirm that the data was received (send a 'request' to the background)
  communicator.request('confirm', { received: true });
});
