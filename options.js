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
  this.get_sites = function(val) {
   return {
    "8tracks": val,
     "bandcamp": val,
     "deezer": val,
     "grooveshark": val,
     "hypem": val,
     "myspace": val,
     "pandora": val,
     "rdio": val,
     "spotify": val,
     "soundcloud": val,
     "slacker": val,
     "stitcher": val,
     "thesixtyone": val,
     "play.google": val,
     "vk": val
    };
  };
};

//***
//Load the default settings if settings are not already in storage (ie. first run)
//***
function load_defaults(d) {
  chrome.storage.local.get(function(obj){
    if(!obj.hasOwnProperty("hotkey-sites")) {chrome.storage.local.set({"hotkey-sites": d.get_sites(true)});}
    restore_options();
  });
}

//***
//Restores form to saved value from chrome storage
//***
function restore_options() {
  chrome.storage.local.get(function(obj) {
    if(obj.hasOwnProperty("hotkey-sites")) {
      for(var site in obj["hotkey-sites"]) {
        if(obj["hotkey-sites"].hasOwnProperty(site)) {
          var name = "#" + site.replace(/\./g, '\\.'); // escaping the dot so jQuery won't confuse it with class query
          if(obj["hotkey-sites"][site]) $(name).prop("checked", true);
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  load_defaults(default_settings);
});

$(function() {
  window.default_settings = new Defaults();
  //On clicking a site name checkbox
  $(".site-enable").change(function() {
    sites = default_settings.get_sites(false);
    $('.site-enable:checked').each(function(index, site) {
      sites[$(site).attr('id')] = true;
    });
    chrome.storage.local.set({'hotkey-sites': sites});
  });
  $("#btn-save").click(function() {
    chrome.runtime.sendMessage({action: "update_keys"});
    chrome.tabs.getCurrent(function(tab) { //close this tab
      chrome.tabs.remove(tab.id, function() { });
    });
  });
});
