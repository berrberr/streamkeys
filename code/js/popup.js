(function() {
  "use strict";

  function $(a){a=document.querySelectorAll(a);return 1<a.length?a:a[0];}

  var tab_url = "";

  var onLoad = function() {
    $("#options-link").setAttribute("href", chrome.runtime.getURL("html/options.html"));

    var music_controls = $("#music-site"),
        fail_message  = $("#fail-message");

    chrome.tabs.getSelected(null, function(tab) {
      tab_url = tab.url;

      var is_disabled = chrome.extension.getBackgroundPage().window.sk_sites.check_temp_disabled(tab_url);

      if (is_disabled === true || is_disabled === false) {
        music_controls.style.display = "block";
        fail_message.style.display   = "none";
        // toggle.style.visibility    = "visible";
        // button_row.style.display   = "block";
        // check.checked              = !is_disabled;
        // fail_message.style.display = "none";
        // setMessage(is_disabled);

        // check_wrapper.style.background = check.checked ? green : red;
        // check_wrapper.style.visibility = "visible";
        // fav.src = "http://g.etfv.co/" + tab_url;

        // if(is_disabled) {
        //   chrome.browserAction.setIcon({
        //     path: chrome.runtime.getURL("icon48_disabled.png"),
        //     tabId: tab.id
        //   });
        // } else {
        //   chrome.browserAction.setIcon({
        //     path: chrome.runtime.getURL("icon48.png"),
        //     tabId: tab.id
        //   });
        // }
      } else {
        // Not a music site
        music_controls.style.display = "none";
        fail_message.style.display   = "block";
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function() {
    $("#enable-site").addEventListener("change", function() {
      // chrome.extension.getBackgroundPage().window.sk_sites.markAsTemporarilyDisabled(tab_url, true);
    });

    onLoad();
  });

}).call(this);
