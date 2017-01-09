;(function() {
  "use strict";

  var BaseController = require("BaseController"),
      _ = require("lodash");

  var multiSelectors = {
    play: [null, null, ".buttons [title='Play']"],
    pause: [null, null, ".buttons [title='Pause']"],
    playPause: ["#play-pause", "#play", null],
    playNext: ["#next", "#next", ".buttons [title='Next']"],
    playPrev: ["#previous", "#previous", ".buttons [title='Previous']"],
    playState: ["#play-pause.playing", "#play.playing", ""],
    iframe: ["#app-player", "#main", ".nowPlayingBar-container"],
    buttonSwitch: ["false", "false", "true"],
    like: [".thumb.up", ".thumb.up", ""],
    dislike: [".thumb.down", ".thumb.down" ,""],
    song: ["#track-name", ".caption .track", ".now-playing-bar :first-child :nth-child(2) :nth-child(1) :first-child"],
    artist: ["#track-artist", ".caption .artist", ".now-playing-bar :first-child :nth-child(2) :nth-child(2) :first-child"]
  };

  var controller = new BaseController({
    siteName: "Spotify"
  });

  controller.checkPlayer = function() {
    var that = this;
    var player = document.querySelector(multiSelectors.iframe[0]) ? "v1" : "v2";
    player = document.querySelector(multiSelectors.iframe[2]) ? "v3" : player;

    if(player == "v1") {
      _.each(multiSelectors, function(value, key) {
        that.selectors[key] = value[0];
      });
      that.buttonSwitch = false;
    }
    else if(player == "v2"){
      _.each(multiSelectors, function(value, key) {
        that.selectors[key] = value[1];
      });
      that.buttonSwitch = false;
    }
    else{
      _.each(multiSelectors, function(value, key) {
        that.selectors[key] = value[2];
      });
      that.buttonSwitch = true;
    }
  };
})();
