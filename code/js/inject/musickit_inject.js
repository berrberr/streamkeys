(function() {
  "use strict";

  if (window.MusicKit) {
    addEventListeners();
  } else {
    document.addEventListener("musickitloaded", addEventListeners);
  }

  function addEventListeners() {
    var Events = window.MusicKit.Events;
    var player = window.MusicKit.getInstance().player;
    player.addEventListener(Events.metadataDidChange, sendState);
    player.addEventListener(Events.playbackStateDidChange, sendState);
  }

  function sendState() {
    var event = new CustomEvent("streamkeys-state", {detail: getState()});
    document.dispatchEvent(event);
  }

  function getState() {
    var player = window.MusicKit.getInstance().player;
    var item = player.nowPlayingItem;
    return {
      albumName: item.albumName,
      artistName: item.artistName,
      artworkURL: item.artworkURL,
      title: item.title,
      isPlaying: player.isPlaying
    };
  }

  document.addEventListener("streamkeys-cmd", function(e) {
    var musicKit = window.MusicKit.getInstance();
    switch (e.detail) {
      case "playPause":
        if (musicKit.player.isPlaying) {
          musicKit.pause();
        } else {
          musicKit.play();
        }
        break;
      case "next":
        musicKit.skipToNextItem();
        break;
      case "prev":
        musicKit.skipToPreviousItem();
        break;
      case "stop":
        musicKit.stop();
        break;
    }
  });
})();
