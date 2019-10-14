/**
 * Simulates _basic_ chrome.sync.storageArea get/set functionality
 */

var _ = require("lodash");
var storageObject = {};

module.exports = {
  get: sinon.spy(function(callback) {
    callback(storageObject);
  }),

  set: sinon.spy(function(obj, callback) {
    _.assignIn(storageObject, obj);

    if(_.isFunction(callback)) callback(true);
  }),

  clear: function() {
    storageObject = {};
  }
};
