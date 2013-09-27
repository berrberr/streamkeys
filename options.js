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

// Restores form to saved value from chrome storage
function restore_options() {
  chrome.storage.local.get(function(obj){
    for(var p in obj) {
      if(p == "hotkey-play-pause") $("#hotkey-play-pause").val(pretty_print(obj[p]));
      if(p == "hotkey-play-next") $("#hotkey-play-next").val(pretty_print(obj[p]));
      if(p == "hotkey-play-prev") $("#hotkey-play-prev").val(pretty_print(obj[p]));
      if(p == "hotkey-mute") $("#hotkey-mute").val(pretty_print(obj[p]));
      if(p == "hotkey-mk-enabled") {if(obj[p]) $("#hotkey-mk-enabled").prop("checked", true);}
      
      console.log(p + "-" + JSON.stringify(obj[p]));
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
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
    chrome_storage();
  });
  $("#btn-save").click(function() {
    chrome.extension.sendMessage({action: "update_keys"});
  });
});
