;(function() {
  "use strict";

  var $ = require("jquery");
  require("./lib/jquery.loadTemplate-1.4.4.min.js");
  var disabledBtnClass = "btn-danger",
      disabledSpanClass = "glyphicon-remove",
      enabledBtnClass = "btn-success",
      enabledSpanClass = "glyphicon-ok";

  var renderSiteButton = function(id, name, checked) {
    var template_name = (checked === "true") ? "#template-enabled" : "#template-disabled";
    $("#sitelist").loadTemplate(
      $(template_name),
      {
        site_id: id,
        site_name: name,
        enabled: checked
      },
      {append: true}
    );
  };

  var toggleSiteButton = function(selector, is_disabled) {
    var el = $(selector),
        span = $($(selector).children("span")[0]);
    var btnClass = (is_disabled === "false") ? [disabledBtnClass, enabledBtnClass] : [enabledBtnClass, disabledBtnClass];
    var spanClass = (is_disabled === "false") ? [disabledSpanClass, enabledSpanClass] : [enabledSpanClass, disabledSpanClass];
    el.addClass(btnClass[0]).removeClass(btnClass[1]);
    span.addClass(spanClass[0]).removeClass(spanClass[1]);
  };

  chrome.runtime.sendMessage({action: "get_sites"}, function(response) {
    console.log("RESP: ", response);
    $.each(response, function(key, val) {
      renderSiteButton(key, val.name, val.enabled);
    });

    //On clicking a site name checkbox
    $(".btn-site-enable").click(function(el) {
      var sites = {},
          el_id = "[id=\"" + el.currentTarget.id + "\"]";

      console.log(el.currentTarget.id);
      console.log(el_id);

      // These are strings not bools, so inverse the attr value with str compare
      var toggleVal = $(el_id).attr("is-enabled") === "true" ? "false" : "true";
      $(el_id).attr("is-enabled", toggleVal);

      // Toggle the button state
      toggleSiteButton(el_id, $(el_id).attr("is-enabled"));

      // Generate localstorage object of form {sitename => enabled}
      $(".btn-site-enable").each(function(index, site) {
        sites[$(site).attr("id")] = $(site).attr("is-enabled");
      });
      console.log(sites);
      chrome.storage.local.set({"hotkey-sites": sites});
    });
  });

  $("#btn-save").click(function() {
    chrome.runtime.sendMessage({action: "update_keys"});
    chrome.tabs.getCurrent(function(tab) { //close this tab
      chrome.tabs.remove(tab.id, function() { });
    });
  });
})();
