;(function() {
  "use strict";

  var BaseController = require("BaseController");

  function getVideoPlayer() {
    // https://stackoverflow.com/questions/42105028/netflix-video-player-in-chrome-how-to-seek
    return `
    var videoPlayer = window.netflix
      .appContext
      .state
      .playerApp
      .getAPI()
      .videoPlayer;
    var id = videoPlayer.getAllPlayerSessionIds()[0];
    var player = videoPlayer.getVideoPlayerBySessionId(id);`;
  }

  var controller = new BaseController({
    siteName: "Netflix",
    play: ".button-nfplayerPlay",
    pause: ".button-nfplayerPause",
    playNext: ".button-nfplayerNextEpisode",
    video: "video",

    playState: ".button-nfplayerPause",
  });

  controller.setPosition = function(time) {
    // https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script/9517879#9517879
    var code = `
    var time = ${time};
    ${getVideoPlayer()}
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
    ${getVideoPlayer()}
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
    ${getVideoPlayer()}
    player.setVolume(vol);
    `;
    var script = document.createElement("script");
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
  };
})();
