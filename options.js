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
  this.codes =
  {
    play: {key: 81, modifier_alt: true, modifier_ctrl: false, modifier_shift: false},
    prev: {key: 65, modifier_alt: true, modifier_ctrl: false, modifier_shift: false},
    next: {key: 83, modifier_alt: true, modifier_ctrl: false, modifier_shift: false},
    mute: {key: 77, modifier_alt: true, modifier_ctrl: false, modifier_shift: false}
  };
  this.mk_codes = {mk_play: 179, mk_prev: 177, mk_next: 176, mk_mute: 173};
  this.mk_enabled = false;
  this.grooveshark_enabled = true;
  this.bandcamp_enabled = true;
  this.rdio_enabled = true;
  this.spotify_enabled = true;
};

//***
//Load the default settings if settings are not already in storage (ie. first run)
//***
function load_defaults(d) {
  chrome.storage.local.get(function(obj){
    if(!obj.hasOwnProperty("hotkey-play-pause")) {chrome.storage.local.set({"hotkey-play-pause": d.codes.play});}
    if(!obj.hasOwnProperty("hotkey-play-next")) {chrome.storage.local.set({"hotkey-play-next": d.codes.next});}
    if(!obj.hasOwnProperty("hotkey-play-prev")) {chrome.storage.local.set({"hotkey-play-prev": d.codes.prev});}
    if(!obj.hasOwnProperty("hotkey-mute")) {chrome.storage.local.set({"hotkey-mute": d.codes.mute});}
    if(!obj.hasOwnProperty("hotkey-mk-enabled")) {chrome.storage.local.set({"hotkey-mk-enabled": d.mk_enabled});}
    if(!obj.hasOwnProperty("hotkey-grooveshark-enabled")) {chrome.storage.local.set({"hotkey-grooveshark-enabled": d.grooveshark_enabled});}
    if(!obj.hasOwnProperty("hotkey-bandcamp-enabled")) {chrome.storage.local.set({"hotkey-bandcamp-enabled": d.bandcamp_enabled});}
    if(!obj.hasOwnProperty("hotkey-rdio-enabled")) {chrome.storage.local.set({"hotkey-rdio-enabled": d.rdio_enabled});}
    if(!obj.hasOwnProperty("hotkey-spotify-enabled")) {chrome.storage.local.set({"hotkey-spotify-enabled": d.spotify_enabled});}
    restore_options();
  });
}

//***
//Restores form to saved value from chrome storage
//***
function restore_options() {
  chrome.storage.local.get(function(obj){
    for(var p in obj) {
      if(p == "hotkey-play-pause") $("#hotkey-play-pause").val(pretty_print(obj[p]));
      if(p == "hotkey-play-next") $("#hotkey-play-next").val(pretty_print(obj[p]));
      if(p == "hotkey-play-prev") $("#hotkey-play-prev").val(pretty_print(obj[p]));
      if(p == "hotkey-mute") $("#hotkey-mute").val(pretty_print(obj[p]));
      if(p == "hotkey-mk-enabled") {if(obj[p]) $("#hotkey-mk-enabled").prop("checked", true);}
      if(p == "hotkey-grooveshark-enabled") {if(obj[p]) $("#hotkey-grooveshark-enabled").prop("checked", true);}
      if(p == "hotkey-bandcamp-enabled") {if(obj[p]) $("#hotkey-bandcamp-enabled").prop("checked", true);}
      if(p == "hotkey-rdio-enabled") {if(obj[p]) $("#hotkey-rdio-enabled").prop("checked", true);}
      if(p == "hotkey-spotify-enabled") {if(obj[p]) $("#hotkey-spotify-enabled").prop("checked", true);}
      console.log(p + "-" + JSON.stringify(obj[p]));
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var default_settings = new Defaults();
  load_defaults(default_settings);
});

$(function() {
  var capturing = false; //are we capturing the next keypress to save as a hotkey?
  var capturing_id = null; //the id of the textbox we are capturing for
  $(document).keydown(function (e) {
    if(capturing && !(e.keyCode in _arr(16,17,18))) {
      console.log(e);
      var obj = {};
      obj[capturing_id] = {
        key: e.keyCode,
        modifier_alt: e.altKey,
        modifier_shift: e.shiftKey,
        modifier_ctrl: e.ctrlKey
      };
      chrome.storage.local.set(obj);
      chrome_storage();
      $("#" + capturing_id).val(pretty_print(obj[capturing_id]));
      capturing = false;
    }
  });
  $(".reset-btn").click(function() {
    capturing_id = $(this).attr("value");
    capturing = true;
  });
  $("#hotkey-mk-enabled").change(function() {
    chrome.storage.local.set({"hotkey-mk-enabled": $("#hotkey-mk-enabled").is(":checked")});
  });
  $("#hotkey-grooveshark-enabled").change(function() {
    chrome.storage.local.set({"hotkey-grooveshark-enabled": $("#hotkey-grooveshark-enabled").is(":checked")});
  });
  $("#hotkey-bandcamp-enabled").change(function() {
    chrome.storage.local.set({"hotkey-bandcamp-enabled": $("#hotkey-bandcamp-enabled").is(":checked")});
  });
  $("#hotkey-rdio-enabled").change(function() {
    chrome.storage.local.set({"hotkey-rdio-enabled": $("#hotkey-rdio-enabled").is(":checked")});
  });
  $("#hotkey-spotify-enabled").change(function() {
    chrome.storage.local.set({"hotkey-spotify-enabled": $("#hotkey-spotify-enabled").is(":checked")});
  });
  $("#btn-save").click(function() {
    chrome.extension.sendMessage({action: "update_keys"});
    chrome.tabs.getCurrent(function(tab) { //close this tab
      chrome.tabs.remove(tab.id, function() { });
    });
  });
});
