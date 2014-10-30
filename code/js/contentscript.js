;(function() {
  "use strict";

  // Set the browser action icon based on site enabled/disabled status
  chrome.runtime.sendMessage({action: "get_icon", url: window.location.host});

  chrome.runtime.sendMessage({action: "get_site_controller", url: window.location.host}, function(controller) {
    if(controller) chrome.runtime.sendMessage({action: "inject_controller", file: "js/controllers/" + controller});
  });
})();
