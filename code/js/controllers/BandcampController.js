;(function() {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Bandcamp",
    playPause: ".playbutton",
    playNext: ".nextbutton",
    playPrev: ".prevbutton",

    playState: ".playbutton.playing",
    song: "a.title_link > span.title",
    artist: "[itemprop=byArtist]",
    art: ".popupImage",

    hidePlayer: true,

    currentTime: ".time_elapsed",
    totalTime: ".time_total"
  });


  controller.getArtData = function(selector) {
    var dataEl = this.doc().querySelector(selector);
    if(dataEl && dataEl.attributes && dataEl.attributes.href) {
      return dataEl.attributes.href.value;
    }

    return null;
  };
})();
