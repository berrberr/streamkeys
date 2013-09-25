var _arr = function() {
  var obj = {};
  for(var i=0; i<arguments.length; i++)
      obj[arguments[i]] = null;

  return obj;
};
// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("color");
  var color = select.children[select.selectedIndex].value;
  localStorage["favorite_color"] = color;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["favorite_color"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("color");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}

function chrome_storage() {
  chrome.storage.local.get(function(obj){console.log("stuff: " + JSON.stringify(obj));});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);

//obj format => id->keycode, {alt, ctrl, shift}->all boolean
function pretty_print(obj) {
  var output = "";
  if(obj.modifier_alt) output += "ALT+";
  if(obj.modifier_ctrl) output += "CTRL+";
  if(obj.modifier_shift) output += "SHIFT+";
  return (output + obj.key);
}

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
      $("#play-pause").val(e.keyCode + "-" + e.altKey);
      capturing = false;
    }
  });
  $("#reset-play-pause").click(function() {
    capturing_id = "play-pause";
    capturing = true;
    //chrome_storage();
  });
});
