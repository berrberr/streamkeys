"use strict";
(function() {
  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "streamsquid",
    play: "#player-play",
    pause: "#player-pause",
    playNext: "#player-next",
    playPrev: "#player-back",
    like: ".queue-item-selected #queue-item-fav-icon",
    playState: "#player-pause",

    // These are not selectors, but attribute names that the overridden getSongData uses
    // Because the attributes contain untruncated song and artist names (unlike the DOM Element text)
    song: "data-track-name",
    artist: "data-artist-name",

    // Yes, there is a typo in this id in the DOM
    currentTime: "#player-time-elpased",
    totalTime: "#player-duration"
  });

  controller.getSelectedQueueItem = function() {
    return this.doc().querySelector(".queue-item.queue-item-selected");
  };

  controller.getSongData = function(dataAttribute) {
    if(!dataAttribute) return null;

    var selectedItem = this.getSelectedQueueItem();
    if (selectedItem && selectedItem.attributes && selectedItem.attributes[dataAttribute]) {
      return selectedItem.attributes[dataAttribute].value;
    }

    return BaseController.prototype.getSongData.call(this, dataAttribute);
  };

  controller.getArtData = function() {
    var selectedItem = this.getSelectedQueueItem();

    if (selectedItem && selectedItem.attributes) {
      var youtubeIdAttribute = selectedItem.attributes["data-ytid"];
      var imageUrlAttribute = selectedItem.attributes["data-image-url"];
      if (imageUrlAttribute && imageUrlAttribute.value) {
        // imageUrlAttribute is sometimes a relative URL which we need to convert to an absolute URL to properly get art data
        return new URL(imageUrlAttribute.value, this.doc().location.protocol + "//" + this.doc().location.host).href;
      }
      else if (youtubeIdAttribute && youtubeIdAttribute.value) {
        return "https://img.youtube.com/vi/" + youtubeIdAttribute.value + "/default.jpg";
      }
    }

    return null;
  };
})();
