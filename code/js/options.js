;(function() {
  "use strict";

  var $ = require("jquery");
  require("./lib/jquery.loadTemplate-1.4.4.min.js");

  function render_site_checkbox(id, name, checked) {
    var template_name = checked ? "#template-enabled" : "#template-disabled";
    $("#sitelist").loadTemplate(
      $(template_name),
      {
        site_id: id,
        site_name: name,
        enabled: checked
      },
      {append: true}
    );
  }

  chrome.runtime.sendMessage({action: "get_sites"}, function(response) {
    console.log("RESP: ", response);
    $.each(response, function(key, val) {
      render_site_checkbox(key, val.name, val.enabled);
    });

    //On clicking a site name checkbox
    $(".btn-site-enable").click(function() {
      var sites = {};
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
