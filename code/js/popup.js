"use strict";

var $ = require("jquery");
require("./lib/jquery.loadTemplate-1.4.4.min.js");
require("./lib/jquery.marquee.js");

var Popup = function() {
  var tab_url = "",
      tab_id = null,
      disabledBtnClass = "btn-disabled",
      enabledBtnClass = "btn-enabled",
      enableSiteBtn = ".js-enabled-site-btn",
      enableTabBtn = ".js-enable-tab-btn";

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
   * @param {JQuery} $el The tab button element
   */
  var toggleTabBtn = function($el) {
    var tabId = $el.attr("data-tab-id");
    var disabled = !$el.hasClass(disabledBtnClass);
    chrome.extension.getBackgroundPage().window.sk_sites.markTabAsDisabled(tabId, disabled);
    $el.toggleClass(disabledBtnClass).toggleClass(enabledBtnClass);
    $el.find("span").toggleClass("glyphicon-remove").toggleClass("glyphicon-ok");
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

    // Create the elements and setup listeners for the new site's container
    if($siteContainer.length === 0) {
      var div_id = "site-" + tab.id;
      var $playerContainer = $("<div>", { id: tab.id, classList: "js-site-player" });
      $playerContainer.loadTemplate(
        $("#template-site-player"),
        {
          "tab_id": div_id,
          "data-tab-id": tab.id,
          "tab_target": tab.id
        }
      );

      var $sibling = $("div.js-site-player").filter(function() {
        return $(this).data("tab-id") < tab.id;
      });
      if($sibling.length > 0) $sibling.after($playerContainer);
      else $("#player").append($playerContainer);

      // Update the siteContainer to the new div for use later
      $siteContainer = $("#site-" + tab.id);

      // Click listener for player controls
      $("[tab-target=" + tab.id +"]").click(function() {
        chrome.runtime.sendMessage({action: "command", command: this.id, tab_target: this.getAttribute("tab-target")});
      });

      // Click listener for site settings
      $siteContainer.find(".js-tab-container").click(function() {
        $siteContainer.find(".music-site-buttons").fadeToggle(100);
        $siteContainer.find(".settings").toggleClass("settings-active");
      });

      $siteContainer.find(".js-enable-tab-btn").click(function() {
        toggleTabBtn($(this));
      });
    }

    // Get the song name element and add data to it if defined
    var $songEl = $siteContainer.find(".js-song-data");
    if(stateData.song) {
      var songText = (stateData.artist) ? stateData.artist + " - " + stateData.song : stateData.song;
      $songEl.css("display", "inline-block");
      $siteContainer.find(".js-site-data").css("margin-bottom", "0");
      // Only update if song data has changed
      if($songEl.text() !== songText) {
        // Remove any old marquees
        $songEl.marquee("destroy");
        $songEl.text(songText);
        if($songEl.outerWidth() > $("#player").width()) {
          var scrollDuration = (parseInt($songEl.outerWidth()) * 15);
          $songEl.bind("finished", function() {
            $(this).find(".js-marquee-wrapper").css("margin-left", "0px");
          }).marquee({
            allowCss3Support: false,
            delayBeforeStart: 2000,
            duration: scrollDuration,
            pauseOnCycle: true
          });
        }
      }
    }
    else {
      $songEl.css("display", "none");
      $siteContainer.find(".js-site-data").css("margin-bottom", "5px");
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
    var that = this;
    if(!tabs.length || tabs.length === 0) {
      $(".js-no-sites").show();
    }
    else {
      $(".js-no-sites").hide();
    }

    tabs.forEach(function(tab) {
      // Call update state before we get response from content script
      // This lets us create the container divs before we get a response, meaning less "flicker" when popup loaded
      that.updateState({}, tab);
      chrome.tabs.sendMessage(tab.id, { action: "getPlayerState" }, function(playerState) {
        console.log("state: ", playerState);
        that.updateState(playerState, tab);
      });
    });
  };

  this.setupListeners = function() {
    // Toggle controls for a site
    $(enableSiteBtn).click(function() {
      var disabled = !$(this).hasClass(disabledBtnClass);
      chrome.extension.getBackgroundPage().window.sk_sites.markSiteAsDisabled(tab_url, disabled);
      toggleEnableBtn($(this), disabled);
      toggleTabBtn(disabled);

      // If we go from site disabled => enabled then the tab button won't update until clicked or popup reset
      // So instead toggle it if click is to enable site based on the tab's previous state
      var tabDisableStatus = !(!disabled && chrome.extension.getBackgroundPage().window.sk_sites.checkTabEnabled(tab_id));
      toggleEnableBtn($(enableTabBtn), tabDisableStatus);
    });

    // Toggle controls for a specific tab
    $(enableTabBtn).click(function() {
      var disabled = !$(enableTabBtn).hasClass(disabledBtnClass);
      chrome.extension.getBackgroundPage().window.sk_sites.markTabAsDisabled(tab_id, disabled);
      toggleEnableBtn($(enableTabBtn), disabled);
    });
  };

  this.onLoad = function() {
    // Setup all element click listeners
    this.setupListeners();

    var that = this;

    // Set the options link to the options page
    $("#options-link").attr("href", chrome.runtime.getURL("html/options.html"));

    // // Checks if the active tab is a music site to show enable/disable buttons
    // chrome.tabs.query({ active: true }, function(tab) {
    //   tab_url = tab[0].url;
    //   tab_id = tab[0].id;

    //   var is_disabled = !chrome.extension.getBackgroundPage().window.sk_sites.checkEnabled(tab_url);
    //   var is_tab_disabled = is_disabled || !chrome.extension.getBackgroundPage().window.sk_sites.checkTabEnabled(tab_id);

    //   toggleEnableBtn($(enableSiteBtn), enableSiteBtnText, is_disabled);
    //   toggleEnableBtn($(enableTabBtn), enableTabBtnText, is_tab_disabled);
    // });

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
