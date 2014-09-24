;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "#btn-playpause",
    playNext: "#btn-ff",
    mute: "#player_volume_icon",
    iframe: "[name=content]"
  });
})();
