String.prototype.URL_check = function() {
  return new RegExp("^(http|https)*(:\/\/)*(.*\.)*(" + this + "|www." + this +")+\.com");
}

var gs = "grooveshark.com";
console.log(gs.URL_check());

chrome.tabs.query({}, function(tabs) {
  for(var i = 0; i < tabs.length; i++) {
  }
});