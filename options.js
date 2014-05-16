// Converts a range of variables into an object so we can use 'in' operator
var _arr = function() {
  var obj = {};
  for(var i=0; i<arguments.length; i++)
      obj[arguments[i]] = null;

  return obj;
};

function chrome_storage() {
  chrome.storage.local.get(function(obj){console.log("stuff: " + JSON.stringify(obj));});
}

// obj format => id->keycode, {alt, ctrl, shift}->all boolean
function pretty_print(obj) {
  var output = "";
  if(obj.modifier_alt) output += "ALT+";
  if(obj.modifier_ctrl) output += "CTRL+";
  if(obj.modifier_shift) output += "SHIFT+";
  return (output + String.fromCharCode(obj.key));
}

//***
//Store default settings
//***
var Defaults = function() {
  this.sites = "8tracks,bandcamp,deezer,grooveshark,hypem,myspace,pandora,rdio,spotify,soundcloud,slacker,stitcher,thesixtyone,play.google,vk";
};

//***
//Load the default settings if settings are not already in storage (ie. first run)
//***
function load_defaults(d) {
  chrome.storage.local.get(function(obj){
    if(!obj.hasOwnProperty("hotkey-sites")) {chrome.storage.local.set({"hotkey-sites": d.sites});}
    restore_options();
  });
}

//***
//Restores form to saved value from chrome storage
//***
function restore_options() {
  chrome.storage.local.get(function(obj){
    for(var p in obj) {
      //Restore multiple site enabled options
      if('hotkey-sites' == p) {
        var sites = obj[p].split(',');
        for (var i in sites) {
					var name = "#" + sites[i].replace(/\./g, '\\.'); // escaping the dot so jQuery won't confuse it with class query
          if(obj[p]) $(name).prop("checked", true);
        }
      }
    }
  });
  console.log(p + "-" + JSON.stringify(obj[p]));
}

document.addEventListener('DOMContentLoaded', function() {
  var default_settings = new Defaults();
  load_defaults(default_settings);
});

$(function() {
  //On clicking a site name checkbox
  $(".site-enable").change(function() {
    sites = [];
    $('.site-enable:checked').each(function(index, site) {
      sites.push($(site).attr('id'));
    });
    chrome.storage.local.set({'hotkey-sites': sites.join(',')});
  });
  $("#btn-save").click(function() {
    chrome.runtime.sendMessage({action: "update_keys"});
    chrome.tabs.getCurrent(function(tab) { //close this tab
      chrome.tabs.remove(tab.id, function() { });
    });
  });
});
