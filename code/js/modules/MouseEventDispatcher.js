"use strict";
(function() {
  /**
   * @typedef {Object} MouseEventOptions
   * @property {Boolean} canBubble - Whether or not the event can bubble.
   * @property {Boolean} cancelable - Whether or not the event's default action can be prevented.
   *
   * @property {AbstractView} view - The event's AbstractView. You should pass the window object here.
   * @property {Number} detail - The event's mouse click count.
   *
   * @property {Number} screenX - The event's screen x coordinate.
   * @property {Number} screenY - The event's screen y coordinate.
   * @property {Number} clientX - The event's client x coordinate.
   * @property {Number} clientY - The event's client y coordinate.
   *
   * @property {Boolean} ctrlKey - Whether or not control key was depressed during the Event.
   * @property {Boolean} altKey - Whether or not alt key was depressed during the Event.
   * @property {Boolean} shiftKey - Whether or not shift key was depressed during the Event.
   * @property {Boolean} metaKey - Whether or not meta key was depressed during the Event.
   *
   * @property {Number} button - The event's mouse button.
   * @property {EventTarget} relatedTarget - The event's related EventTarget. Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
   */

  /**
   * @class MouseEventDispatcher
   * @classdesc Mouse event dispatcher.
   * @static
   */
  function MouseEventDispatcher() {
    throw "MouseEventDispatcher cannot be instantiated.";
  }

  /**
   * Possible types for mouse event.
   *
   * @name MouseEventDispatcher.eventTypes
   * @type String[]
   * @static
   */
  MouseEventDispatcher.eventTypes = [
    "mouseclick",
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
   * @memberof MouseEventDispatcher
   * @method dispatch
   * @param {(HTMLElement|String)} target - Target element or selector.
   * @param {String} eventType - Mouse event type, e.g. "click", "dblclick", "mousedown", etc.
   * @param {MouseEventOptions} [options] - Mouse event options. More info: {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent}
   * @static
   */
  MouseEventDispatcher.dispatch = function(target, eventType, options) {
    if (typeof target === "string") {
      target = document.querySelector(target);
    }

    // XXX: Dumb case so we don't overrite BaseController::click
    if (eventType === "mouseclick") {
      eventType = "click";
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
   * Call handler for each mouse event types.
   *
   * @memberof MouseEventDispatcher
   * @method eachTypes
   * @param {Function} handler
   * @static
   */
  MouseEventDispatcher.eachTypes = function(handler) {
    for (var i = 0; i < this.eventTypes.length; i++) {
      handler(this.eventTypes[i]);
    }
  };

  // Extend class by event type.

  /**
   * @memberof MouseEventDispatcher
   * @method mouseclick
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  /**
   * @memberof MouseEventDispatcher
   * @method dblclick
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  /**
   * @memberof MouseEventDispatcher
   * @method mousedown
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  /**
   * @memberof MouseEventDispatcher
   * @method mouseenter
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  /**
   * @memberof MouseEventDispatcher
   * @method mouseleave
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  /**
   * @memberof MouseEventDispatcher
   * @method mousemove
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  /**
   * @memberof MouseEventDispatcher
   * @method mouseout
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  /**
   * @memberof MouseEventDispatcher
   * @method mouseover
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  /**
   * @memberof MouseEventDispatcher
   * @method mouseup
   * @param {(HTMLElement|String)} target
   * @param {MouseEventOptions} [options]
   * @static
   */

  MouseEventDispatcher.eachTypes(function(eventType) {
    MouseEventDispatcher[eventType] = function(target, options) {
      MouseEventDispatcher.dispatch(target, eventType, options);
    };
  });

  module.exports = MouseEventDispatcher;
})();
