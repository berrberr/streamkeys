;(function() {
  "use strict";

  chrome.runtime.sendMessage({action: "check_music_site"}, function(resp) {
    if(resp) {
      // Set the browser action icon based on site enabled/disabled status
      chrome.runtime.sendMessage({action: "set_icon"});

      chrome.runtime.sendMessage({action: "get_site_controller"}, function(controller) {
        if(controller) chrome.runtime.sendMessage({action: "inject_controller", file: "js/controllers/" + controller});
      });
    }
  });
})();
