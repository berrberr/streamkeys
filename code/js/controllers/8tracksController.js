;(function() {
  "use strict";

  var BaseController = require("BaseController");

  function EightTracksController() {
    // super constructor
    BaseController.apply(this, arguments);

    // playNext is an array of selectors.
    // Find the first selector whose style display != none and use that.
    // This is because in 8Tracks the next button doesn't work if you're
    // at the end of your mix, so you have to click the "next_mix_button".
    var originalPlayNext = this.selectors.playNext;
    Object.defineProperty(this.selectors, "playNext", {
      get: function() {
        for (var i = 0; i < originalPlayNext.length; i++) {
          var el = this.doc().querySelector(originalPlayNext[i]);
          if (el && el.style.display !== "none") {
            return originalPlayNext[i];
          }
        }
        // None are valid, just return the first selector
        return originalPlayNext[0];
      }.bind(this)
    });
  }
  EightTracksController.prototype = Object.create(BaseController.prototype);
  EightTracksController.prototype.constructor = BaseController;

  new EightTracksController({
    siteName: "8tracks",
    play: "#player_play_button",
    pause: "#player_pause_button",
    playNext: ["#player_skip_button", "#next_mix_button"],
    mute: ".volume-mute",
    like: ".mix-like.inactive",
    dislike: ".mix-like.active",

    song: "li.track.now_playing div.title_container div.title_artist span.t",
    artist: "li.track.now_playing div.title_container div.title_artist span.a"
  });
})();
