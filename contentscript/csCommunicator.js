// Manages a single tab connection

var communicator = (function() {
  // Register this tab to the background script
  var port = chrome.extension.connect();
  console.log('Requesting connection to background script', port);

  // Public methods
  return {
    /**
     * A 'request' is a message from the content script sent to the background script
     * @param message
     * @param callback
     */
    request: function(message, callback) {
      chrome.extension.sendMessage(message, function(response) {
        callback(response);
      });
    },

    /**
     * Is called when a background script calls 'communicator.notify'
     * @param event
     * @param callback
     */
    on: function(event, callback) {
      chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.event == event) {
          callback.call(this, request.message);
          sendResponse && sendResponse(request.message);
        }
      });
    }
  }
})();