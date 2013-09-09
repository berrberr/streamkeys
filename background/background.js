chrome.commands.getAll(function (coms) {
  for(var i = 0; i < coms.length; i++) {
    console.log(coms[i]);
  }
});

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
    postLogin();
});

function postLogin() {
  var data = "username=berrberr&password=gobrox";
  console.log("posting login");
  $.post("https://grooveshark.com/empty.html", data, function (data) {
    console.log("successful post: " + data);
  });
}