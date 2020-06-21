"use strict";
(function() {
  chrome.runtime.sendMessage({ action: "check_music_site" }, function(response) {
    if(response && response !== "no_inject") {
      chrome.runtime.sendMessage({ action: "get_site_controller" }, function(controller) {
        if(controller) chrome.runtime.sendMessage({ action: "inject_controller", file: "js/controllers/" + controller });
      });
    }
  });
})();
