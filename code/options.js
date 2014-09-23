"use strict";

function render_site_checkbox(id, name, checked) {
  $("#sitelist").loadTemplate(
    $("#template"),
    {
      site_id: id,
      site_name: name,
      enabled: checked
    },
    {append: true}
  );
}

$(function() {
  chrome.runtime.sendMessage({action: "get_sites"}, function(response) {
    console.log("RESP: ", response);
    $.each(response, function(key, val) {
      render_site_checkbox(key, val.name, val.enabled);
    });

    //On clicking a site name checkbox
    $(".site-enable").click(function() {
      var sites = {};
      $(".site-enable").each(function(index, site) {
        sites[$(site).attr("id")] = $(site).prop("checked");
      });
      chrome.storage.local.set({"hotkey-sites": sites});
    });
  });

  $("#btn-save").click(function() {
    chrome.runtime.sendMessage({action: "update_keys"});
    chrome.tabs.getCurrent(function(tab) { //close this tab
      chrome.tabs.remove(tab.id, function() { });
    });
  });
});
