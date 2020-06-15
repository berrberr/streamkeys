"use strict";
(function() {
  var sk_log = require("../modules/SKLog.js");
  document.addEventListener("streamkeys-cmd", function(e) {
    if(e.detail === "next") {
      try {
        $(".p_avancar").mousedown().mouseup();
        sk_log("playNext");
      } catch (exception) {
        sk_log("playNext", exception, true);
      }
    } else if(e.detail === "prev") {
      try {
        $(".p_voltar").mousedown().mouseup();
        sk_log("playPrev");
      } catch (exception) {
        sk_log("playPrev", exception, true);
      }
    }
  });
})();
