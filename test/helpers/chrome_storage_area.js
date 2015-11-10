/**
 * Simulates _basic_ chrome.local.storageArea get/set functionality
 */

var _ = require("lodash");
var storageObject = {};

module.exports = {
  get: sinon.spy(function(callback) {
    callback(storageObject);
  }),

  set: sinon.spy(function(obj, callback) {
    _.extend(storageObject, obj);

    if(_.isFunction(callback)) callback(true);
  })
};
