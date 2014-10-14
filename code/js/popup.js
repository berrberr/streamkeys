"use strict";
chrome.runtime.onMessage.addListener(function(request) {
  window.alert(request);
  console.log(request);
});
