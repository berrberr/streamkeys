;(function() {
  "use strict";

  var BaseController = require("BaseController");

  new BaseController({
    siteName: "Pluralsight",
    play: "[data-text='Play (k)'] button",
    pause: "[data-text='Pause (k)'] button",
    playNext: "[data-text='Forward 10 seconds (→)'] button",
    playPrev: "[data-text='Back 10 seconds (←)'] button",
    mute: "[data-text='Mute (m)'] button",
    playState: "[data-text='Pause (k)'] button",
    song: 'div.course-title'
  });
})();
