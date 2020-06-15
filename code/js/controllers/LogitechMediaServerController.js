"use strict";
(function() {
  var BaseController = require("BaseController");

  new BaseController({
    buttonSwitch: true,
    play: "#ctrlTogglePlay button[title='Play']",
    pause: "#ctrlTogglePlay button[title='Pause']",
    playNext: ".btn-next button[title='Next']",
    playPrev: ".btn-previous button[title='Previous']",
  });
})();
