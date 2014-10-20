(function() {
  "use strict";

  function $(a){a=document.querySelectorAll(a);return 1<a.length?a:a[0];}

  var tab_url = "";

  var onLoad = function() {
    $("#options-link").setAttribute("href", chrome.runtime.getURL("html/options.html"));

    var toggle        = $(".toggle"),
        check_wrapper = $(".check-box-wrapper"),
        fail_message  = $("#fail-message"),
        check         = $("#check"),
        fav           = $("#tab-favicon"),
        info          = $("#info-message"),
        red           = "#cc3737",
        green         = "#2dcc70";

    check.addEventListener("change", function() {
      check_wrapper.style.background = check.checked ? green : red;
      info.innerText = "site temporarily " + (!check.checked ? "disabled" : "enabled");
    });

    chrome.tabs.getSelected(null, function(tab) {
      tab_url = tab.url;

      var is_disabled = chrome.extension.getBackgroundPage().window.sk_sites.check_temp_disabled(tab_url);

      if (is_disabled === null || is_disabled === undefined) {
        toggle.style.display       = "none";
        fail_message.style.display = "block";

      } else if (is_disabled === true || is_disabled === false) {
        toggle.style.display       = "block";
        check.checked              = !is_disabled;
        fail_message.style.display = "none";
        info.innerText = "site temporarily " + (is_disabled ? "disabled" : "enabled");

        check_wrapper.style.background = check.checked ? green : red;
        fav.src = "http://g.etfv.co/" + tab_url;
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
