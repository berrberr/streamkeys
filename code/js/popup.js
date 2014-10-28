(function() {
  "use strict";

  var $ = require("jquery"),
      tab_url = "",
      tab_id = null,
      disabledBtnClass = "btn-danger",
      enableSiteBtn = "#enable-site",
      enableSiteBtnText = {enable: "Enabled for this site", disable: "Disabled for this site"},
      enableTabBtn = "#enable-tab",
      enableTabBtnText = {enable: "Enabled for this tab", disable: "Disabled for this tab"},
      popupSize = {
        musicSite: "185px",
        disabledMusicSite: "155px"
      };

  var toggleEnableBtn = function(ele, text, is_disabled) {
    if(is_disabled) {
      ele.addClass(disabledBtnClass);
      ele.html(
        "<span class=\"glyphicon glyphicon-remove\"></span>" + text.disable);
    } else {
      ele.removeClass(disabledBtnClass);
      ele.html(
        "<span class=\"glyphicon glyphicon-ok\"></span>" + text.enable);
    }
  };

  var toggleTabBtn = function(is_disabled) {
    if(is_disabled) {
      $(enableTabBtn).css("display", "none");
      document.body.style.height = popupSize.disabledMusicSite;
    } else {
      $(enableTabBtn).css("display", "inline-block");
      document.body.style.height = popupSize.musicSite;
    }
  };

  var onLoad = function() {
    $("#options-link").attr("href", chrome.runtime.getURL("html/options.html"));

    var music_controls = $("#music-site"),
        fail_message = $("#fail-message");

    chrome.tabs.getSelected(null, function(tab) {
      tab_url = tab.url;
      tab_id = tab.id;

      var is_disabled = !chrome.extension.getBackgroundPage().window.sk_sites.checkEnabled(tab_url);
      var is_tab_disabled = !chrome.extension.getBackgroundPage().window.sk_sites.checkTabEnabled(tab_id);
      var is_music_site = chrome.extension.getBackgroundPage().window.sk_sites.checkMusicSite(tab_url);

      if(!is_music_site) {
        music_controls.css("display", "none");
        fail_message.css("display", "block");
      } else {
        toggleTabBtn(is_disabled);
      }

      toggleEnableBtn($(enableSiteBtn), enableSiteBtnText, is_disabled);
      toggleEnableBtn($(enableTabBtn), enableTabBtnText, is_tab_disabled);
    });
  };

  document.addEventListener("DOMContentLoaded", function() {

    // Toggle controls for a site
    $(enableSiteBtn).click(function() {
      var disabled = !$(enableSiteBtn).hasClass(disabledBtnClass);
      chrome.extension.getBackgroundPage().window.sk_sites.markSiteAsDisabled(tab_url, disabled);
      toggleEnableBtn($(enableSiteBtn), enableSiteBtnText, disabled);
      toggleTabBtn(disabled);
    });

    // Toggle controls for a specific tab
    $(enableTabBtn).click(function() {
      var disabled = !$(enableTabBtn).hasClass(disabledBtnClass);
      chrome.extension.getBackgroundPage().window.sk_sites.markTabAsDisabled(tab_id, disabled);
      //toggleEnableTabBtn(disabled);
      toggleEnableBtn($(enableTabBtn), enableTabBtnText, disabled);
    });

    $(".sk-playcontrols").click(function(el) {
      console.log(el);
      console.log($(el));
      console.log($(el).attr("id"));
      chrome.runtime.sendMessage({action: "command", command: el.currentTarget.id});
    });

    onLoad();
  });

}).call(this);
