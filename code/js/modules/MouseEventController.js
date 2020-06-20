"use strict";
(function() {
  var BaseController = require("BaseController"),
    MouseEventDispatcher = require("../modules/MouseEventDispatcher.js"),
    sk_log = require("../modules/SKLog.js");

  /**
   * @class MouseEventController
   * @extends BaseController
   * @constructor
   */
  function MouseEventController() {
    BaseController.apply(this, arguments);
  }

  MouseEventController.prototype = Object.create(BaseController.prototype);
  MouseEventController.prototype.constructor = MouseEventController;

  /**
   * Dispatch "mouseclick" mouse "click" event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  /**
   * Dispatch "dblclick" mouse event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  /**
   * Dispatch "mousedown" mouse event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  /**
   * Dispatch "mouseenter" mouse event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  /**
   * Dispatch "mouseleave" mouse event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  /**
   * Dispatch "mousemove" mouse event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  /**
   * Dispatch "mouseout" mouse event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  /**
   * Dispatch "mouseover" mouse event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  /**
   * Dispatch "mouseup" mouse event inside document
   * @param {String} opts.selectorButton - css selector for element
   */

  MouseEventDispatcher.eachTypes(function(eventType) {
    // no override
    if (Object.prototype.hasOwnProperty.call(BaseController.prototype,eventType)) {
      return;
    }
    // based on click method
    MouseEventController.prototype[eventType] = function(opts, mouseOpts) {
      opts = opts || {};
      if (opts.selectorButton === null) {
        sk_log("disabled", opts.action);
        return;
      }
      try {
        var button = this.doc().querySelector(opts.selectorButton);
        MouseEventDispatcher.dispatch(button, eventType, mouseOpts);
        if (opts.action) {
          sk_log(opts.action);
        }
      } catch (e) {
        sk_log("Element not found for " + eventType + ".", opts.selectorButton, true);
      }

      this.updatePlayerState();
    };
  });

  module.exports = MouseEventController;
})();
