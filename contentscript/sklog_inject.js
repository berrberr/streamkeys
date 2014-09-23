window.sk_log = function(msg, obj, err) {
    "use strict";
    obj = obj || "";
    if (err) {
        console.error("STREAMKEYS-ERROR: " + msg, obj);
    } else {
        console.log("STREAMKEYS-INFO: " + msg, obj);
    }
};
