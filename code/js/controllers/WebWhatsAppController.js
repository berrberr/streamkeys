; (function () {
  "use strict";

  var BaseController = require("BaseController");

  var controller = new BaseController({
    siteName: "Web WhatsApp",
    // artist: "SENDER-NAME-SELECTOR",
    // song: "GROUP-NAME-SELECTOR"
    media: "audio"
  });

  var voicemails;
  var currentNo = 0;

  controller.getMedia = function () {
    // get all voicemails by their 'audio'-selector and return the first one
    voicemails = controller.doc().querySelectorAll(this.selectors.media);
    return voicemails[currentNo];
  };

  controller.playNext = function () {
    // stop current voicemail, move to next (if there is one) and play it
    controller.stop();
    currentNo = Math.min(currentNo + 1, voicemails.length - 1);
    controller.playPause();
  };

  controller.playPrev = function () {
    // stop current voicemail, move to previous (if there is one) and play it
    controller.stop();
    currentNo = Math.max(currentNo - 1, 0);
    controller.playPause();
  };

})();
