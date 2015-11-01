;(function() {
  "use strict";

  require("BaseController").init({
    siteName: "Overcast.fm",
    playPause: "#playpausebutton",
    playNext: "#seekforwardbutton",
    playPrev: "#seekbackbutton",

    playState: "#playpausebutton_pauseicon",
    song: ".title"
  });
})();
