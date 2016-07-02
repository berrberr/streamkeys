;(function() {
  "use strict";

  /**
   * Mouse events dispatcher.
   *
   * @class MouseEventDispatcher
   * @static
   */
  function MouseEventDispatcher() {
    throw "MouseEventDispatcher cannot be instantiated.";
  }

  /**
   * Possible types for mouse event.
   *
   * @property eventTypes
   * @type {String[]}
   * @static
   */
  MouseEventDispatcher.eventTypes = [
    "click",
    "dblclick",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
  ];

  /**
   * Dispatch custom mouse event.
   *
   * @method dispatch
   * @param {(HTMLElement|String)} target - Target element or selector.
   * @param {String} eventType - Mouse event type, e.g. "click", "dblclick", "mousedown", etc.
   * @param {Object} [options] - Mouse event options. More info: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
   * @static
   */
  MouseEventDispatcher.dispatch = function(target, eventType, options) {
    if (typeof target === "string") {
      target = document.querySelector(target);
    }
    if (!(target instanceof HTMLElement)) {
      return;
    }

    options = options || {};

    var event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      eventType,
      options.canBubble || true,
      options.cancelable || true,

      options.view || window,
      options.detail || 1,

      options.screenX || 0,
      options.screenY || 0,
      options.clientX || 0,
      options.clientY || 0,

      options.ctrlKey || false,
      options.altKey || false,
      options.shiftKey || false,
      options.metaKey || false,

      options.button || 0,
      options.relatedTarget || null
    );

    target.dispatchEvent(event);
  };

  /**
   * Call handler for each mouse event types
   *
   * @method eachTypes
   * @param {Function} handler
   * @static
   */
  MouseEventDispatcher.eachTypes = function(handler) {
    for (var i = 0; i < this.eventTypes.length; i++) {
      handler(this.eventTypes[i]);
    }
  };

  // Extend class by event type

  /**
   * @method click
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  /**
   * @method dblclick
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  /**
   * @method mousedown
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  /**
   * @method mouseenter
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  /**
   * @method mouseleave
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  /**
   * @method mousemove
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  /**
   * @method mouseout
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  /**
   * @method mouseover
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  /**
   * @method mouseup
   * @param {(HTMLElement|String)} target
   * @param {Object} [options]
   * @static
   */

  MouseEventDispatcher.eachTypes(function(eventType) {
    MouseEventDispatcher[eventType] = function(target, options) {
      MouseEventDispatcher.dispatch(target, eventType, options);
    };
  });

  module.exports = MouseEventDispatcher;
})();
