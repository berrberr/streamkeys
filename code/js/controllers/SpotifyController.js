;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      $ = require("jquery");

  var multiSelectors = {
    play: ["#play-pause", "#play", ".buttons [title='Play']"],
    pause: ["#play-pause", "#play", ".buttons [title='Pause']"],
    playNext: ["#next", "#next", ".buttons [title='Next']"],
    playPrev: ["#previous", "#previous", ".buttons [title='Previous']"],
    playState: ["#play-pause.playing", "#play.playing", ""],
    iframe: ["#app-player", "#main", ".top-container"],
    buttonSwitch: ["false", "false", "true"],
    like: [".thumb.up", ".thumb.up", ""],
    dislike: [".thumb.down", ".thumb.down" ,""],
    song: ["#track-name", ".caption .track", ".track-info-name"],
    artist: ["#track-artist", ".caption .artist", ".track-info-artists"]
  };

  var controller = new BaseController({
    siteName: "Spotify",
  });

  controller.checkPlayer = function() {
    var that = this;
    var player = document.querySelector(multiSelectors.iframe[0]) ? "v1" : "v2";
    player = document.querySelector(multiSelectors.iframe[2]) ? "v3" : player;

    if(player == "v1") {
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[0];
      });
    }
    else if(player == "v2"){
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[1];
      });
    }
    else{
      $.each(multiSelectors, function(key, value) {
        that.selectors[key] = value[2];
      });
    }
  };
})();
