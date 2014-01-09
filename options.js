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
  this.mk_enabled = true;
  this.sites =
  {
    "8track": true,
    bandcamp: true,
    deezer: true,
    grooveshark: true,
    hypem: true,
    myspace: true,
    pandora: true,
    rdio: true,
    spotify: true,
    soundcloud: true
  };
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
    if(!obj.hasOwnProperty("hotkey-mk-on")) {chrome.storage.local.set({"hotkey-mk-on": d.mk_enabled});}
    if(!obj.hasOwnProperty("hotkey-grooveshark-enabled")) {chrome.storage.local.set({"hotkey-grooveshark-enabled": d.sites.grooveshark});}
    if(!obj.hasOwnProperty("hotkey-bandcamp-enabled")) {chrome.storage.local.set({"hotkey-bandcamp-enabled": d.sites.bandcamp});}
    if(!obj.hasOwnProperty("hotkey-rdio-enabled")) {chrome.storage.local.set({"hotkey-rdio-enabled": d.sites.rdio});}
    if(!obj.hasOwnProperty("hotkey-spotify-enabled")) {chrome.storage.local.set({"hotkey-spotify-enabled": d.sites.spotify});}
    if(!obj.hasOwnProperty("hotkey-pandora-enabled")) {chrome.storage.local.set({"hotkey-pandora-enabled": d.sites.pandora});}
    if(!obj.hasOwnProperty("hotkey-myspace-enabled")) {chrome.storage.local.set({"hotkey-myspace-enabled": d.sites.myspace});}
    if(!obj.hasOwnProperty("hotkey-hypem-enabled")) {chrome.storage.local.set({"hotkey-hypem-enabled": d.sites.hypem});}
    if(!obj.hasOwnProperty("hotkey-soundcloud-enabled")) {chrome.storage.local.set({"hotkey-soundcloud-enabled": d.sites.soundcloud});}
    if(!obj.hasOwnProperty("hotkey-deezer-enabled")) {chrome.storage.local.set({"hotkey-deezer-enabled": d.sites.deezer});}
    if(!obj.hasOwnProperty("hotkey-8track-enabled")) {chrome.storage.local.set({"hotkey-8track-enabled": d.sites["8track"]});}
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
      if(p == "hotkey-mk-on") {if(obj[p]) $("#hotkey-mk-on").prop("checked", true);}
      //Restore multiple site enabled options
      if(p.slice(-7) == "enabled" && p.slice(0, 6) == "hotkey") {
        var name = "#" + p;
        if(obj[p]) $(name).prop("checked", true);
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
      $('.capturing-alert').hide();
    }
  });
  $(".reset-btn").click(function() {
    capturing_id = $(this).attr("value");
    $(this).parent().next().show();
    capturing = true;
  });
  $("#hotkey-mk-on").change(function() {
    chrome.storage.local.set({"hotkey-mk-on": $("#hotkey-mk-on").is(":checked")});
  });
  //On clicking a site name checkbox
  $(".site-enable").change(function() {
    var id = $(this).attr("id");
    var js_id = "#" + id;
    var storage_obj = {};
    storage_obj[id] = $(js_id).is(":checked");
    chrome.storage.local.set(storage_obj);
  });
  $("#btn-save").click(function() {
    chrome.runtime.sendMessage({action: "update_keys"});
    chrome.tabs.getCurrent(function(tab) { //close this tab
      chrome.tabs.remove(tab.id, function() { });
    });
  });
});
