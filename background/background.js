// chrome.commands.onCommand.addListener(function(command) {
//   console.log("command: " + command);
//   if (command == "play-pause")
//     communicator.notify("play-pause", { data: "foo" });
//   if (command == "play-next")
//     communicator.notify("play-next", null);
//   if (command == "play-prev")
//     communicator.notify("play-prev", null);
//   if (command == "mute")
//     communicator.notify("mute", null);
// });
var url_patterns = {grooveshark: "*://*.grooveshark.com/*"};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.tabs.query({url: url_patterns.grooveshark}, function(tabs) {
    if(tabs.length > 0) {
      console.log("BG request:" + request.action + " SEND TO: " + tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, request.action);
    }
  });
});