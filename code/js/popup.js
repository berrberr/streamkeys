(function() {
  "use strict";

  function $(a){a=document.querySelectorAll(a);return 1<a.length?a:a[0];}

  var tab_url = "";

  var onLoad = function() {
    $("#options-link").setAttribute("href", chrome.runtime.getURL("html/options.html"));

    var toggle        = $(".toggle"),
        button_row     = $(".top-row"),
        check_wrapper = $(".check-box-wrapper"),
        fail_message  = $("#fail-message"),
        check         = $("#check"),
        fav           = $("#tab-favicon"),
        info          = $("#info-message"),
        red           = "#CC3737",
        green         = "#2DCC70";

    var setMessage = function(disabled) {
      if(disabled) {
        info.innerText = "Temporarily disabled";
      } else {
        info.innerText = "Enabled";
      }
    };

    check.addEventListener("change", function() {
      check_wrapper.style.background = check.checked ? green : red;
      setMessage(!check.checked);
    });

    chrome.tabs.getSelected(null, function(tab) {
      tab_url = tab.url;

      var is_disabled = chrome.extension.getBackgroundPage().window.sk_sites.check_temp_disabled(tab_url);

      if (is_disabled === true || is_disabled === false) {
        toggle.style.visibility    = "visible";
        button_row.style.display   = "block";
        check.checked              = !is_disabled;
        fail_message.style.display = "none";
        setMessage(is_disabled);

        check_wrapper.style.background = check.checked ? green : red;
        check_wrapper.style.visibility = "visible";
        fav.src = "http://g.etfv.co/" + tab_url;

        if(is_disabled) {
          chrome.browserAction.setIcon({
            path: chrome.runtime.getURL("icon48_disabled.png"),
            tabId: tab.id
          });
        } else {
          chrome.browserAction.setIcon({
            path: chrome.runtime.getURL("icon48.png"),
            tabId: tab.id
          });
        }
      } else {
        toggle.style.visibility    = "hidden";
        button_row.style.display   = "none";
        fail_message.style.display = "inline-block";
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function() {
    $("#check").addEventListener("change", function() {
      chrome.extension.getBackgroundPage().window.sk_sites.markAsTemporarilyDisabled(tab_url, $("#check").checked);
    });

    onLoad();
  });

}).call(this);
