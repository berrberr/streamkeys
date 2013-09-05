// Manages the connections to all tabs.
// Note: a tab is registered when the "matches" rule applies to a given url scheme (defined in manifest.json).

var communicator = (function() {
  // all registered tabs
  var channelTabs = [];

  // a tab requests connection to the background script
  chrome.extension.onConnect.addListener(function(port) {
    var tabId = port.sender.tab.id;
    console.log('Received request from content script', port);

    // add tab when opened
    if (channelTabs.indexOf(tabId) == -1) {
      channelTabs.push(tabId);
    }

    // remove when closed/directed to another url
    port.onDisconnect.addListener(function() {
      channelTabs.splice(channelTabs.indexOf(tabId), 1);
    });
  });

  // public
  return {
    /**
     * Notifies all registered tabs
     *
     * @param event
     * @param message
     * @param callback
     */
    notify: function(event, message, callback) {
      var notification = { event: event, message: message  };
      for(var i = 0, len = channelTabs.length; i < len; i++) {
        chrome.tabs.sendMessage(channelTabs[i], notification, callback);
      }
    },

    /**
     * Listens for messages on all tabs (sent by 'communicator.request')
     *
     * @param event
     * @param callback
     */
    on: function(event, callback) {
      chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request == event) {
          sendResponse(callback());
        }
      });
    }
  };
})();