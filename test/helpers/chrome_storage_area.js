/**
 * Simulates _basic_ chrome.sync.storageArea get/set functionality
 */

"use strict";
var _ = require("lodash"), sinon = require("sinon");

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
