
/**
 * Register a callback function with the commands api, which will be called when
 * one of our registered commands is detected.
 GroovesharkProxy.setSongStatusCallback(function(status) {
  console.log("Status", status);
})
 */

 // chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
 //  if (request.internalVariable) {
 //    //var internal_object = JSON.parse(request.internalVariable);
 //    //gs_obj.setName_(request.internalVariable);
 //    alert(request.internalVariable);
 //  }
 // });

// a tab requests connection to the background script
chrome.extension.onConnect.addListener(function(port) {
  var tabId = port.sender.tab.id;
  console.log('Received request from content script', port);

  // add tab when opened
  if (channelTabs.indexOf(tabId) == -1) {
    channelTabs.push(tabId);
  }

  // remove when closed/directed to another url
  port.onDisconnect.addListener(function() {
    channelTabs.splice(channelTabs.indexOf(tabId), 1);
  });
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == 'play-pause') {
    chrome.extension.sendMessage({internalVariable : "play-pause"});
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
