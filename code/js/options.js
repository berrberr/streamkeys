;(function() {
  "use strict";

  var $ = require("jquery");
  require("./lib/jquery.loadTemplate-1.4.4.min.js");
  var disabledBtnClass = "btn-danger",
      disabledSpanClass = "glyphicon-remove",
      enabledBtnClass = "btn-success",
      enabledSpanClass = "glyphicon-ok";

  // @param id [str] id of site, used as key in settings object
  // @param name [str] full name of site, displayed in button
  // @param is_enabled [bool] BOOLEAN if button is enabled or not
  var renderSiteButton = function(id, name, is_enabled) {
    var template_name = is_enabled ? "#template-enabled" : "#template-disabled";
    $("#sitelist").loadTemplate(
      $(template_name),
      {
        site_id: id,
        site_name: name,
        enabled: is_enabled
      },
      {append: true}
    );
  };

  // @param selector [str] CSS selector for button to toggle
  // @param is_disabled [str] STRING representation of BOOLEAN
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
          site_id = el.currentTarget.id,
          el_id = "[id=\"" + el.currentTarget.id + "\"]";

      console.log(el.currentTarget.id);
      console.log(el_id);

      // These are strings not bools, so inverse the attr value with str compare
      var toggleVal = $(el_id).attr("is-enabled") === "true" ? "false" : "true";
      $(el_id).attr("is-enabled", toggleVal);

      // Toggle the button state
      toggleSiteButton(el_id, $(el_id).attr("is-enabled"));

      // Generate localstorage object of form {sitename => enabled}
      // Convert the string representation into boolean
      $(".btn-site-enable").each(function(index, site) {
        sites[$(site).attr("id")] = JSON.parse($(site).attr("is-enabled"));
      });

      chrome.storage.local.set({"hotkey-sites": sites}, function() {
        chrome.runtime.sendMessage({action: "update_keys", site_id: site_id});
      });
    });
  });
})();
