;(function() {
  "use strict";
  chrome.runtime.sendMessage({action: "get_site_controller", url: window.location.host}, function(controller) {
    if(controller) chrome.runtime.sendMessage({action: "inject_controller", file: "js/controllers/" + controller});
  });
})();
