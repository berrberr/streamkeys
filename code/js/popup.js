(function() {
  "use strict";

  var $ = require("jquery"),
      tab_url = "",
      tab_id = null,
      disabledBtnClass = "btn-error-border",
      enableSiteBtn = "#enable-site",
      enableSiteBtnText = {enable: "Enabled for this site", disable: "Disabled for this site"},
      enableTabBtn = "#enable-tab",
      enableTabBtnText = {enable: "Enabled for this tab", disable: "Disabled for this tab"},
      popupSize = {
        musicSite: "185px",
        disabledMusicSite: "155px"
      };

  var toggleEnableBtn = function(ele, text, is_disabled) {
    var icon = is_disabled ? "icon38_disabled.png" : "icon38.png";
    chrome.browserAction.setIcon({
      path: chrome.runtime.getURL(icon),
      tabId: tab_id
    });
    console.log("ICON: ", icon);
    if(is_disabled) {
      ele.addClass(disabledBtnClass);
      ele.html(
        "<span class=\"glyphicon glyphicon-remove\"></span>" + text.disable);
    }
    else {
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

  var updateState = function(stateData) {
    console.log("update state called", stateData);
    if(stateData.song && stateData.artist) {
      $(".js-song-data").text(stateData.song + " - " + stateData.artist);
    }

    if(stateData.isPlaying) {
      $("#playPause").html("<span class=\"glyphicon player-glyphicon glyphicon-pause\"></span>");
    }
    else {
      $("#playPause").html("<span class=\"glyphicon player-glyphicon glyphicon-play\"></span>");
    }
  };

  var onLoad = function() {
    $("#options-link").attr("href", chrome.runtime.getURL("html/options.html"));

    var music_controls = $("#music-site"),
        fail_message = $("#fail-message");

    chrome.tabs.query({ active: true }, function(tab) {
      tab_url = tab[0].url;
      tab_id = tab[0].id;

      var is_disabled = !chrome.extension.getBackgroundPage().window.sk_sites.checkEnabled(tab_url);
      var is_tab_disabled = is_disabled || !chrome.extension.getBackgroundPage().window.sk_sites.checkTabEnabled(tab_id);
      var is_music_site = chrome.extension.getBackgroundPage().window.sk_sites.checkMusicSite(tab_url);

      if(!is_music_site) {
        music_controls.css("display", "none");
        fail_message.css("display", "block");
      }
      else {
        toggleTabBtn(is_disabled);
      }

      toggleEnableBtn($(enableSiteBtn), enableSiteBtnText, is_disabled);
      toggleEnableBtn($(enableTabBtn), enableTabBtnText, is_tab_disabled);
    });

    // Make a request to get the site's player state
    // This will then trigger a message to update the popup contents
    chrome.runtime.sendMessage({action: "command", command: "getPlayerState"});
  };

  document.addEventListener("DOMContentLoaded", function() {

    // Toggle controls for a site
    $(enableSiteBtn).click(function() {
      var disabled = !$(enableSiteBtn).hasClass(disabledBtnClass);
      chrome.extension.getBackgroundPage().window.sk_sites.markSiteAsDisabled(tab_url, disabled);
      toggleEnableBtn($(enableSiteBtn), enableSiteBtnText, disabled);
      toggleTabBtn(disabled);

      // If we go from site disabled => enabled then the tab button won't update until clicked or popup reset
      // So instead toggle it if click is to enable site based on the tab's previous state
      var tabDisableStatus = !(!disabled && chrome.extension.getBackgroundPage().window.sk_sites.checkTabEnabled(tab_id));
      toggleEnableBtn($(enableTabBtn), enableTabBtnText, tabDisableStatus);
    });

    // Toggle controls for a specific tab
    $(enableTabBtn).click(function() {
      var disabled = !$(enableTabBtn).hasClass(disabledBtnClass);
      chrome.extension.getBackgroundPage().window.sk_sites.markTabAsDisabled(tab_id, disabled);
      //toggleEnableTabBtn(disabled);
      toggleEnableBtn($(enableTabBtn), enableTabBtnText, disabled);
    });

    $(".sk-playcontrols").click(function(el) {
      chrome.runtime.sendMessage({action: "command", command: el.currentTarget.id});
    });

    $(".test-btn").click(function(el) {
      chrome.runtime.sendMessage({action: "command", command: el.currentTarget.id});
    });

    chrome.runtime.onMessage.addListener(function(request) {
      if(request.action === "update_popup_state" && request.stateData) updateState(request.stateData);
    });

    onLoad();
  });
}).call(this);
