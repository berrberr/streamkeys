;(function() {
  "use strict";

  require("../modules/BaseController.js").init({
    playPause: "#radioControlPlay",
    play: "#radioControlPlay",
    pause: "#radioControlPause",
    playNext: "#radioControlSkip",
    like: "#radioControlLove"
  });
})();
