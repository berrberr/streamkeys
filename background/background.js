//***
//Returns a regex that matches where the string is in a url's (domain) name
//***
var URL_check = function(domain) {
  "use strict";
  return (new RegExp("^(http|https)*(:\/\/)*(.*\\.)*(" + domain + "|www." + domain +")+\\.com"));
};

//Class for storing keycodes and helper functions
var Stored_data = function() {
  this.sites =
  {
    "8tracks": false,
    "bandcamp": false,
    "deezer": false,
    "grooveshark": false,
    "hypem": false,
    "myspace": false,
    "pandora": false,
    "rdio": false,
    "spotify": false,
    "soundcloud": false,
    "slacker": false,
    "stitcher": false,
    "thesixtyone": false,
    "play.google": false,
    "vk": false
  };
};
 
//***
//Load setting from chrome extension storage into the Keys object
//***
Stored_data.prototype.load = (function() {
  var _data = this;
  chrome.storage.local.get(function(obj) {
    for(var p in obj) {
      if('hotkey-sites' == p) {
				var sites = obj[p].split(',');
        for (var site in _data.sites)
          _data.sites[site] = -1 != sites.indexOf(site);
      }
    }
		if (!obj['hotkey-sites']) // user didn't open settings, go all-on
			for (var site in _data.sites)
          _data.sites[site] = -1 != true;
    //console.log("HOTKEYS: " + JSON.stringify(hotkeys));
  });
});

var URL_cache = function()
{
  this.site = {
    "8tracks": null,
    "bandcamp": null,
    "deezer": null,
    "earbits": null,
    "grooveshark": null,
    "hypem": null,
    "myspace": null,
    "pandora": null,
    "rdio": null,
    "spotify": null,
    "songza": null,
    "soundcloud": null,
    "slacker": null,
    "stitcher": null,
    "thesixtyone": null,
    "play.google": null,
    "vk": null
  };
};

//***
//Set a site's tab id to null when it's tab is closed
//***
URL_cache.prototype.remove_by_id = function(id) {
  for(var name in this.site) {
    if(this.site[name] == id) this.site[name] = null;
  }
};

//***
//Returns a list of sites to find tabID's for
//***
URL_cache.prototype.get_sites_to_find = function () {
  var tabs_to_find = [];
  for(var name in this.site) {
    if(this.site[name] === null) {
      tabs_to_find.push({"name": name, "url_regex": URL_check(name)});
    }
  }
  return tabs_to_find;
};

var cache = new URL_cache();
var data = new Stored_data();
data.load();

//***
//When a tab is closed if it is in the cache then remove it from the cache
//***
chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {cache.remove_by_id(tabID);});

//***
//Searches tabs array for the first matching domain of site_name and sends the requested action to that tab
//***
function query_tabs(tabs, site_name, request_action) {
  if(tabs.length > 0) {
    console.log("BG request:" + request.action + " SEND TO: " + tabs[0].title);
    chrome.tabs.sendMessage(tabs[0].id, {action: request_action, site: site_name});
  }
}

//***
//Send an action request to the music player's tab
//**
function send(cache, action) {
  for(var name in cache.site) {
    if(data.sites[name] && cache.site[name] !== null) { //If the site we are sending to is enabled in the settings, and the tab we are sending to exists
      console.log("BG request:" + action + " SEND TO: " + cache.site[name]);
      chrome.tabs.sendMessage(cache.site[name], {"action": action, "site": name});
    }
  }
}

//***
//Capture hotkeys and send their actions to tab(s) with music player running
//***
chrome.commands.onCommand.addListener(function(command) {
  chrome.runtime.sendMessage({"action": command});
  var tabs_to_find = cache.get_sites_to_find();
  chrome.tabs.query({}, function(tabs) {
    for(var i = 0; i < tabs.length; i++) {
      for(var j = 0; j < tabs_to_find.length; j++) {
        if(tabs_to_find[j].url_regex.test(tabs[i].url)){
          cache.site[tabs_to_find[j].name] = tabs[i].id;
          tabs_to_find.splice(j, 1);
        }
      }
    }
    console.log("URL CACHE: " + JSON.stringify(cache));
    send(cache, command);
  });
});

//***
//Sent from content scripts on creation
//***
chrome.runtime.onMessage.addListener(function(request, sender, response) {
	if(request.action == "update_keys") {
		data.load();
	}
  console.log("CONTENT SCRIPT TAB:", sender);
});

//***
//Open info page on install/update
//***
chrome.runtime.onInstalled.addListener(function (details) {
  if(details.reason == "install") {
    chrome.tabs.create({url: "http://www.streamkeys.com/help.html?installed=true"});
  } else if(details.reason == "update") {
    chrome.tabs.create({url: "http://www.streamkeys.com/help.html?updated=true"});
  }
});

