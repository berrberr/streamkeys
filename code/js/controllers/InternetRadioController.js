(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Internet Radio",

    play() { this.launchPlayback(0); },
    playNext() { this.launchPlayback(1); },
    playPrev() { this.launchPlayback(-1); },

    pause() {
      var pauseButtons = this.getElements('.jp-pause');
      var stationIndex = this.getPlayingStationIndex();
      if (stationIndex != -1)
        pauseButtons[stationIndex].click();
    },

    isPlaying() {
      return this.getPlayingStationIndex() != -1;
    },

    // Custom methods:

    lastPlayingStationIndex: 0,

    launchPlayback(delta) {
      var playButtons = this.getElements('.jp-play');
      var stationIndex = this.getCurrentStationIndex();

      stationIndex += delta;
      if (stationIndex >= playButtons.length)
        stationIndex = 0;

      playButtons[stationIndex].click();
    },

    getPlayingStationIndex() {
      var index = this.getElements('.jp-pause')
        .findIndex((element) => this.isVisible(element));
      if (index != -1)
        this.lastPlayingStationIndex = index;
      return index;
    },

    getCurrentStationIndex() {
      var index = this.getPlayingStationIndex();
      if (index != -1) return index;
      return this.lastPlayingStationIndex;
    }

  });

})();
