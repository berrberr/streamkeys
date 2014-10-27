(function() {
  "use strict";

  var $ = require("jquery"),
      tab_url = "",
      disabledBtnClass = "btn-danger";

  var toggleEnableBtn = function(is_disabled) {
    var enable_site_btn = $("#enable-site");
    if(is_disabled) {
      enable_site_btn.addClass(disabledBtnClass);
      enable_site_btn.html(
        "<span class=\"glyphicon glyphicon-remove\"></span>Disabled for this site");
    } else {
      enable_site_btn.removeClass(disabledBtnClass);
      enable_site_btn.html(
        "<span class=\"glyphicon glyphicon-ok\"></span>Enabled for this site");
    }
    console.log("toggld");
  };

  var onLoad = function() {
    $("#options-link").attr("href", chrome.runtime.getURL("html/options.html"));

    var music_controls = $("#music-site"),
        fail_message = $("#fail-message");

    chrome.tabs.getSelected(null, function(tab) {
      tab_url = tab.url;

      var is_disabled = chrome.extension.getBackgroundPage().window.sk_sites.checkTemporarilyDisabled(tab_url);
      var is_music_site = chrome.extension.getBackgroundPage().window.sk_sites.checkEnabled(tab_url);

      if(is_music_site) {
        document.body.style.height = "185px";
      } else {
        music_controls.css("display", "none");
        fail_message.css("display", "block");
      }

      console.log("Togglin: ", is_disabled);
      toggleEnableBtn(is_disabled);
      if(is_disabled) {
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
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function() {

    $("#enable-site").click(function() {
      var disabled = !$("#enable-site").hasClass(disabledBtnClass);
      chrome.extension.getBackgroundPage().window.sk_sites.markAsTemporarilyDisabled(tab_url, disabled);
      toggleEnableBtn(disabled);
    });

    onLoad();
  });

}).call(this);
