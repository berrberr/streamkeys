;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      _ = require("lodash");

  var multiSelectors = {
    play: [".player-play-pause.play", ".button-nfplayerPlay"],
    pause: [".player-play-pause.pause", ".button-nfplayerPause"],
    playNext: [".player-next-episode", ".button-nfplayerNextEpisode"],
    mute: [".player-control-button.volume", ".button-volumeLow, .button-volumeMedium, .button-volumeMax, .button-volumeMuted"],
    video: "video",

    playState: [".player-play-pause.pause",".button-nfplayerPause"],
    song: [".player-status-main-title", ".title"]
  };

  var controller = new BaseController({
    siteName: "Netflix"
  });

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

  controller.checkPlayer = function() {
    var that = this;

    if(this.doc().querySelector(multiSelectors.play[0]) || this.doc().querySelector(multiSelectors.pause[0])) {
      _.each(multiSelectors, function(value, key) {
        that.selectors[key] = value[0];
      });
    } else {
      _.each(multiSelectors, function(value, key) {
        that.selectors[key] = value[1];
      });
    }
  };
})();
