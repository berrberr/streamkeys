"use strict";

var Popup = function() {

  var $ = require("jquery");
  require("./lib/jquery.marquee.min.js");

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

  this.updateState = function(stateData, tab) {
    stateData = stateData || {song: "test"};
    console.log("update state called", stateData);
    console.log("from: ", tab.id);

    // Get the site's container div by tab id
    var siteContainer = $("#site-" + tab.id);
    if(siteContainer.length === 0) {
      var site_id = "site-" + tab.id;
      $(".js-player-row")
        .append($("<div>", { id: site_id })
        .append($("<span>", { "class": "site-data" }))
        .append($("<div>", { "class": "song-data js-song-data" })));
      siteContainer = $("#site-" + tab.id);
    }

    if(stateData.song) {
      //var songText = (stateData.artist) ? stateData.artist + " - " + stateData.song : stateData.song;
      var songText = "THIS IS A LONG STRING THAT SHOULD HAVE TO SCROLL CUZ ITS LONG";
      var $songEl = siteContainer.find(".js-song-data");
      $songEl.text(songText);
      if($songEl.prop("scrollHeight") > ($songEl.prop("clientHeight") + parseInt($songEl.css("padding")))) {
        var duration = 5000;
        $songEl.marquee({
          duration: duration,
          delayBeforeStart: duration
        });

        //var $tmpMarquee = $("<div>", { "class": "tmp-marquee" });
        //$tmpMarquee.text(songText);
        //
        //$songEl.prepend($tmpMarquee);
        //console.log($tmpMarquee.width());
        //console.log($tmpMarquee.prop("scrollWidth"));
        //console.log($tmpMarquee.prop("clientWidth"));
        //$tmpMarquee.animate({
        //  marginLeft: "-" + $tmpMarquee.width()
        //}, 5000, function() { console.log($tmpMarquee); });
      }

      //$(".js-song-data").text(stateData.song + " - " + stateData.artist);
    }

    if(tab.favIconUrl) {
      siteContainer.find(".site-data").append($("<img>", { src: tab.favIconUrl, "class": "site-favicon" }));
    }
    siteContainer.find(".site-data").append($("<p>", { text: stateData.siteName, "class": "site-title" }));

    console.log(stateData.isPlaying);
    if(stateData.isPlaying) {
      $("#playPause").html("<span class=\"glyphicon player-glyphicon glyphicon-pause\"></span>");
      //$(".js-player-row").show();
    }
    else {
      $("#playPause").html("<span class=\"glyphicon player-glyphicon glyphicon-play\"></span>");
      //$(".js-player-row").hide();
    }
  };

  var getTabStates = function(tabs) {
    console.log("ACTIVE TABS: ", tabs);
    console.log("SCOPE: ", this);
    var that = this;
    tabs.forEach(function(tab) {
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
      //toggleEnableTabBtn(disabled);
      toggleEnableBtn($(enableTabBtn), enableTabBtnText, disabled);
    });

    $(".sk-playcontrols").click(function(el) {
      chrome.runtime.sendMessage({action: "command", command: el.currentTarget.id});
    });

    $(".test-btn").click(function(el) {
      chrome.runtime.sendMessage({action: "command", command: el.currentTarget.id});
    });
  };

  this.onLoad = function() {
    // Setup all element click listeners
    this.setupListeners();

    var music_controls = $("#music-site");

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
    chrome.runtime.onMessage.addListener(function(request, sender) {
      if(request.action === "update_popup_state" && request.stateData) this.updateState(request.stateData, sender);
    });
  };

  console.log("Enclosing scope: ", this);
};

document.addEventListener("DOMContentLoaded", function() {
  window.popup = new Popup();
  window.popup.onLoad();
});
