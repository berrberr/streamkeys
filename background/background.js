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
var gs_tab = {id: null};

function get_gs_tab() {
  chrome.tabs.query({url: url_patterns.grooveshark}, function(tabs) {
    console.log("get_gs_tab: " + tabs[0].id);
    if(tabs.length > 0) {
      console.log("HIT" + tabs[0].id + " " + tabs.length);
      gs_tab.id = tabs[0].id;
    }
  });
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if(gs_tab.id == null) {
    get_gs_tab();
  }
  chrome.tabs.sendMessage(137, request.action);
  console.log(request);
});
// communicator.on("play", function(){
//   msg = "test"; 
//   console.log("tst");
//   communicator.notify("play-pause", null);
// });