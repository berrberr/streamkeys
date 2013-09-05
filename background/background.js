// this script relies on bgCommunicator.js. That provides the connection outside to the content script


chrome.commands.onCommand.addListener(function(command) {
  if (command == 'play-pause') {
    communicator.notify('play-pause', { data: 'foo' });
    // chrome.tabs.query({}, function(tabs) {
    //   for (var i = 0; i < tabs.length; i++) {
    //     console.log(tabs[i].url);
    //   }
    //   alert("done");
    // });
  }
});
