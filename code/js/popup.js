"use strict";

var Popup = function() {

  var $ = require("jquery");
  require("./lib/jquery.marquee.min.js");
  require("./lib/jquery.loadTemplate-1.4.4.min.js");

  var tab_url = "",
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

  /**
   * Toggles one of the buttons to enable/disable for a site or a tab
   * @param ele {Node} button element
   * @param text {String} text to set the button to
   * @param is_disabled {Boolean} true if button should be disabled
   */
  var toggleEnableBtn = function(ele, text, is_disabled) {
    var icon = is_disabled ? "icon38_disabled.png" : "icon38.png";
    chrome.browserAction.setIcon({
      path: chrome.runtime.getURL(icon),
      tabId: tab_id
    });
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

  /**
   * Toggles the "Disable For Tab" button
   * @param is_disabled {Boolean} true if button should be disabled
   */
  var toggleTabBtn = function(is_disabled) {
    if(is_disabled) {
      $(enableTabBtn).css("display", "none");
      document.body.style.height = popupSize.disabledMusicSite;
    } else {
      $(enableTabBtn).css("display", "inline-block");
      document.body.style.height = popupSize.musicSite;
    }
  };

  /**
   * Update the song info in the popup
   * @param stateData {Object} contains the current player state information
   * @param tab {Object} tab info returned from Chrome API calls
   */
  this.updateState = function(stateData, tab) {
    stateData = stateData || {};
    console.log("update state called", stateData);
    console.log("from: ", tab.id);

    // Get the site's container div by tab id
    var $siteContainer = $("#site-" + tab.id);
    if($siteContainer.length === 0) {
      var tab_id = "site-" + tab.id;
      $("#player").loadTemplate(
        $("#template-site-player"),
        {
          "tab_id": tab_id,
          "tab_target": tab.id
        },
        { append: true }
      );
      $siteContainer = $("#site-" + tab.id);

      // Setup player controls listeners
      $("[tab-target=" + tab.id +"]").click(function() {
        chrome.runtime.sendMessage({action: "command", command: this.id, tab_target: this.getAttribute("tab-target")});
      });
  }

    // Get the song name element and add data to it if defined
    var $songEl = $siteContainer.find(".js-song-data");
    if(stateData.song) {
      var songText = (stateData.artist) ? stateData.artist + " - " + stateData.song : stateData.song;
      $songEl.css("display", "inline-block");
      $songEl.text(songText);
      if($songEl.prop("scrollHeight") > ($songEl.prop("clientHeight") + parseInt($songEl.css("padding")))) {
        $songEl.marquee({
          duration: 3000,
          delayBeforeStart: 3000
        });
      }
    }
    else {
      $songEl.css("display", "none");
    }

    // Set the site favicon
    if(tab.favIconUrl) {
      $siteContainer.find(".js-site-data").find(".js-site-favicon").show();
      $siteContainer.find(".js-site-data").find(".js-site-favicon").attr("src", tab.favIconUrl);
    }
    else {
      $siteContainer.find(".js-site-data").find(".js-site-favicon").hide();
    }

    // Set the site name
    $siteContainer.find(".js-site-data").find(".js-site-title").text(stateData.siteName);

    // Set the player row buttons
    console.log(stateData.isPlaying);
    if(stateData.isPlaying) {
      $siteContainer.find("#playPause > span").removeClass("glyphicon-play").addClass("glyphicon-pause");
    }
    else {
      $siteContainer.find("#playPause > span").removeClass("glyphicon-pause").addClass("glyphicon-play");
    }
  };

  /**
   * Query each active music tab for the player state, then update the popup state
   * @param tabs {Array} array of active music tabs
   */
  var getTabStates = function(tabs) {
    console.log("ACTIVE TABS: ", tabs);
    var that = this;
    tabs.sort(function(a, b) {
      return a.id - b.id;
    }).forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, { action: "getPlayerState" }, function(playerState) {
        console.log("state: ", playerState);
        that.updateState(playerState, tab);
      });
    });
  };

  this.setupListeners = function() {
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
      toggleEnableBtn($(enableTabBtn), enableTabBtnText, disabled);
    });
  };

  this.onLoad = function() {
    // Setup all element click listeners
    this.setupListeners();

    var music_controls = $("#music-site");
    var that = this;

    // Set the options link to the options page
    $("#options-link").attr("href", chrome.runtime.getURL("html/options.html"));

    // Checks if the active tab is a music site to show enable/disable buttons
    chrome.tabs.query({ active: true }, function(tab) {
      tab_url = tab[0].url;
      tab_id = tab[0].id;

      var is_disabled = !chrome.extension.getBackgroundPage().window.sk_sites.checkEnabled(tab_url);
      var is_tab_disabled = is_disabled || !chrome.extension.getBackgroundPage().window.sk_sites.checkTabEnabled(tab_id);
      var is_music_site = chrome.extension.getBackgroundPage().window.sk_sites.checkMusicSite(tab_url);

      if(!is_music_site) {
        music_controls.css("display", "none");
      }
      else {
        toggleTabBtn(is_disabled);
      }

      toggleEnableBtn($(enableSiteBtn), enableSiteBtnText, is_disabled);
      toggleEnableBtn($(enableTabBtn), enableTabBtnText, is_tab_disabled);
    });

    // Send a request to get the player state of every active music site tab
    chrome.runtime.sendMessage({ action: "get_active_tabs" }, getTabStates.bind(this));

    // Setup listener for updating the popup state
    chrome.runtime.onMessage.addListener(function(request) {
      if(request.action === "update_popup_state" && request.stateData) that.updateState(request.stateData, request.fromTab);
    });
  };
};

document.addEventListener("DOMContentLoaded", function() {
  window.popup = new Popup();
  window.popup.onLoad();
});
