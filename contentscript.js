// JS script injection, so that we can read the JS class 'InternalJSVariable'
/*var postGsObj = function() {
  var textarea = document.getElementById('transfer-dom-area');
  //var tstmsg = new Object({ t1 : 1, t2 : "t2" });
  textarea.value = JSON.stringify(gs_obj);
  //textarea.value = "TESTING";
};

// Create a dummy textarea DOM.
var textarea = document.createElement('textarea');
textarea.setAttribute('id', 'transfer-dom-area');
textarea.style.display = 'none';
document.body.appendChild(textarea);

// Start injecting the JS script.
var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + postGsObj + ')();'));
document.body.appendChild(script);

// Inform our world that we have received the friend map data.
chrome.extension.sendMessage({internalVariable: textarea.value});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  alert("tst");
  if (request.internalVariable) {
    alert("recv-req" + request.internalVariable);
  }
 });*/
// Clean up since we no longer need this.
//document.body.removeChild(textarea);

var port = chrome.extension.connect();

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.foo == "bar") {

    sendResponse && sendResponse("success");
  }
});