
/**
 * Register a callback function with the commands api, which will be called when
 * one of our registered commands is detected.
 GroovesharkProxy.setSongStatusCallback(function(status) {
  console.log("Status", status);
})
 */
 var gs_obj = {
  name : "gs",
  data : 1234,
  setName_ : function(str){ this.name = str; }
 };

 chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.internalVariable) {
    //var internal_object = JSON.parse(request.internalVariable);
    gs_obj.setName_(request.internalVariable);
    alert(gs_obj.name);
  }
 });

chrome.commands.onCommand.addListener(function(command) {
  if (command == 'play-pause') {

    chrome.tabs.query({}, function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
        console.log(tabs[i].url);
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
