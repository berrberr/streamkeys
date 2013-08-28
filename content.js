
/**
 * Register a callback function with the commands api, which will be called when
 * one of our registered commands is detected.
 GroovesharkProxy.setSongStatusCallback(function(status) {
  console.log("Status", status);
})
 */
chrome.commands.onCommand.addListener(function(command) {
  if (command == 'play-pause') {
    //alert("test");
    chrome.tabs.query({}, function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
        window.console.log(tabs[i].url);
      }
      alert("done");
    });
  }
  // Call 'update' with an empty properties object to get access to the current
  // tab (given to us in the callback function).
  chrome.tabs.update({}, function(tab) {
    //var song_info = window.Grooveshark.getCurrentSongStatus();
    
    if (command == 'next-song')
      window.Grooveshark.next();
    else if (command == 'previous-song')
      window.Grooveshark.previous();
  });
});
