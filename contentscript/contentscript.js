// this script relies on csCommunicator.js

communicator.on('play-pause', function(obj) {
  //document.getElementById("d1").innerHTML += "pressed!";
  console.log("play-pause pressed");
  if(typeof window.Grooveshark != 'undefined') {
    alert(window.Grooveshark.getCurrentSongStatus().status);
  }
});

communicator.on('iconClicked', function(obj) {
  console.log('Icon was clicked. Received following data:', obj);

  // confirm that the data was received (send a 'request' to the background)
  communicator.request('confirm', { received: true });
});