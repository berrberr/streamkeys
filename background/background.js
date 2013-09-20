chrome.commands.onCommand.addListener(function(command) {
  console.log("command: " + command);
  if (command == "play-pause")
    communicator.notify("play-pause", { data: "foo" });
  if (command == "play-next")
    communicator.notify("play-next", null);
  if (command == "play-prev")
    communicator.notify("play-prev", null);
  if (command == "mute")
    communicator.notify("mute", null);
  if (command == "login")
    communicator.notify("login", null);
});