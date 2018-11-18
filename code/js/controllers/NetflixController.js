;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Netflix",
    play: ".button-nfplayerPlay",
    pause: ".button-nfplayerPause",
    playNext: ".button-nfplayerNextEpisode",
    mute: [".button-volumeMuted", ".button-volumeLow", ".button-volumeMedium", ".button-volumeMax"],
    video: "video",

    playState: ".button-nfplayerPause",
  });

  controller.setPosition = function(time) {
    // https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script/9517879#9517879
    var code = `
    var time = ${time};
    // https://stackoverflow.com/questions/42105028/netflix-video-player-in-chrome-how-to-seek
    var videoPlayer = window.netflix
      .appContext
      .state
      .playerApp
      .getAPI()
      .videoPlayer;
    var id = videoPlayer.getAllPlayerSessionIds()[0];
    var player = videoPlayer.getVideoPlayerBySessionId(id);
    // seek works with milliseconds
    player.seek(time * 1000);
    `;
    var script = document.createElement("script");
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
  };

  controller.seek = function(time) {
    // https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script/9517879#9517879
    var code = `
    var time = ${time};
    // https://stackoverflow.com/questions/42105028/netflix-video-player-in-chrome-how-to-seek
    var videoPlayer = window.netflix
      .appContext
      .state
      .playerApp
      .getAPI()
      .videoPlayer;
    var id = videoPlayer.getAllPlayerSessionIds()[0];
    var player = videoPlayer.getVideoPlayerBySessionId(id);
    // seek works with milliseconds
    player.seek(player.getCurrentTime() + time * 1000);
    `;
    var script = document.createElement("script");
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
  };

  controller.setVolume = function(volume) {
    // https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script/9517879#9517879
    var code = `
    var vol = ${volume};
    var videoPlayer = window.netflix
      .appContext
      .state
      .playerApp
      .getAPI()
      .videoPlayer;
    var id = videoPlayer.getAllPlayerSessionIds()[0];
    var player = videoPlayer.getVideoPlayerBySessionId(id);
    player.setVolume(vol);
    `;
    var script = document.createElement("script");
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
  };
})();
