// this script relies on bgCommunicator.js. That provides the connection outside to the content script
chrome.commands.onCommand.addListener(function(command) {
  if (command == "play-pause")
    communicator.notify("play-pause", { data: "foo" });
  if (command == "play-next")
    communicator.notify("play-next", null);
  if (command == "play-prev")
    communicator.notify("play-prev", null);
  if (command == "mute")
    communicator.notify("mute", null);
});
