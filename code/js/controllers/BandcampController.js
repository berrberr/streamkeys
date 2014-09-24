//var controller = new BaseController();

// controller.init({
//   playPause: ".playbutton",
//   playNext: ".nextbutton",
//   playPrev: ".prevbutton"
// });

;(function() {
  "use strict";

  require("./BaseController.js").init({
    playPause: ".playbutton",
    playNext: ".nextbutton",
    playPrev: ".prevbutton"
  });
})();
