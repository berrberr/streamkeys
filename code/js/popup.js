"use strict";

var $ = require("jquery");
require("./lib/jquery.loadTemplate-1.4.4.min.js");
require("./lib/jquery.marquee.js");

var Popup = function() {
  var disabledBtnClass = "btn-disabled";

  /**
   * Toggles the "Disable For Tab" button
   * @param {JQuery} $el - The tab button element
   * @param {Boolean} [enabled] - Should the tab button be enabled
   */
  this.toggleTabBtn = function($el, enabled) {
    var tabId = $el.attr("data-tab-id");
    var $siteContainer = $("#" + tabId);
    if(typeof enabled === "undefined") {
      enabled = $el.hasClass(disabledBtnClass);
      chrome.extension.getBackgroundPage().window.sk_sites.markTabAsDisabled(tabId, !enabled);
    }
    console.log("enabled: ", enabled);
    if(enabled) {
      $siteContainer.removeClass("disabled");
      $el.find(".btn-text").text("Tab Enabled");
      $el.removeClass(disabledBtnClass);
      $el.find(".glyphicon").addClass("glyphicon-ok").removeClass("glyphicon-remove");
    }
    else {
      $siteContainer.addClass("disabled");
      $el.find(".btn-text").text("Tab Disabled");
      $el.addClass(disabledBtnClass);
      $el.find(".glyphicon").addClass("glyphicon-remove").removeClass("glyphicon-ok");
    }
  };

  /**
   * Update the song info in the popup
   * @param {Object} stateData - contains the current player state information
   * @param {Object} tab - tab info returned from Chrome API calls
   */
  this.updateState = function(stateData, tab) {
    stateData = stateData || {};
    console.log("update state called", stateData);
    console.log("from: ", tab.id);

    // Get the site's container div by tab id
    var $siteContainer = $("#site-" + tab.id);
    var that = this;

    // Create the elements and setup listeners for the new site's container
    if($siteContainer.length === 0) {
      var div_id = "site-" + tab.id;
      var $playerContainer = $("<div>", { id: tab.id, "class": "js-site-player" });
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

      // Click listener for enabled/disable tab button
      $siteContainer.find(".js-enable-tab-btn").click(function() {
        that.toggleTabBtn($(this));
        $(this).parent().hide();
      });

      $siteContainer.find(".js-tab-link").click(function() {
        chrome.tabs.update(parseInt($(this).attr("data-tab-id")), { selected: true });
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
            delayBeforeStart: 2500,
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
    if(stateData.isPlaying) {
      $siteContainer.find("#playPause > span").removeClass("glyphicon-play").addClass("glyphicon-pause");
    }
    else {
      $siteContainer.find("#playPause > span").removeClass("glyphicon-pause").addClass("glyphicon-play");
    }

    // Set the button state for dislike
    if(stateData.canDislike) {
      $siteContainer.find("#dislike").removeClass("disabled");
    }
    else {
      $siteContainer.find("#dislike").addClass("disabled");
    }

    // Set the button state for playPrev
    if(stateData.canPlayPrev) {
      $siteContainer.find("#playPrev").removeClass("disabled");
    }
    else {
      $siteContainer.find("#playPrev").addClass("disabled");
    }

    // Set the button state for playPause
    if(stateData.canPlayPause) {
      $siteContainer.find("#playPause").removeClass("disabled");
    }
    else {
      $siteContainer.find("#playPause").addClass("disabled");
    }

    // Set the button state for playNext
    if(stateData.canPlayNext) {
      $siteContainer.find("#playNext").removeClass("disabled");
    }
    else {
      $siteContainer.find("#playNext").addClass("disabled");
    }

    // Set the button state for like
    if(stateData.canLike) {
      $siteContainer.find("#like").removeClass("disabled");
    }
    else {
      $siteContainer.find("#like").addClass("disabled");
    }

    // Set the tab enabled button
    if(typeof tab.streamkeysEnabled === "boolean") {
      this.toggleTabBtn($siteContainer.find(".js-enable-tab-btn"), tab.streamkeysEnabled);
    }
  };

  /**
   * Query each active music tab for the player state, then update the popup state
   * @param {Array} tabs - array of active music tabs
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

  this.onLoad = function() {
    var that = this;

    // Set the options link to the options page
    $("#options-link").attr("href", chrome.runtime.getURL("html/options.html"));

    // Send a request to get the player state of every active music site tab
    chrome.runtime.sendMessage({ action: "get_music_tabs" }, getTabStates.bind(this));

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
