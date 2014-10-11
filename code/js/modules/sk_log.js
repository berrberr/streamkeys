;(function() {
  "use strict";

  module.exports = function(msg, obj, err) {
    if(msg) {
      obj = obj || "";
      if(err) {
        console.error("STREAMKEYS-ERROR: " + msg, obj);
        msg = "ERROR: " + msg;
      }
      else { console.log("STREAMKEYS-INFO: " + msg, obj); }

      console.log("DISPATCHING EVENT: " + msg);
      document.dispatchEvent(new CustomEvent("streamkeys-test-response", {detail: msg}));
    }
  };
})();
