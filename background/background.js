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
  return chrome.tabs.query({url: url_patterns.grooveshark}, function(tabs) {
    console.log("get_gs_tab: " + tabs[0].id);
    if(tabs.length > 0) {
      console.log("HIT" + tabs[0].id + " " + tabs.length);
      return tabs[0].id;
    } else {
      return false;
    }
  });
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  var tabid = get_gs_tab();
  if(tabid) {
  chrome.tabs.sendMessage(tabid, request.action);
  console.log("BG request:" + request.action + " SEND TO: " + gs_tab.id);
} else {console.log("nogstab");}
});
// communicator.on("play", function(){
//   msg = "test"; 
//   console.log("tst");
//   communicator.notify("play-pause", null);
// });