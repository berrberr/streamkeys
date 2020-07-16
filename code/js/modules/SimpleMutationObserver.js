"use strict";
(function() {
  /**
   * @typedef {Object} HandlerStorageSelector
   * @property {Function[]} inserted - Contains handlers for inserted event.
   * @property {Function[]} removed - Contains handlers for removed event.
   */

  /**
   * @typedef {Object} HandlerStorage
   * @property {HandlerStorageSelector} selector-1 - Tracked selector 1.
   * @property {HandlerStorageSelector} selector-2 - Tracked selector 2.
   * @property {HandlerStorageSelector} selector-N - Tracked selector N.
   */


  /**
   * Construct a new SimpleMutationObserver
   *
   * @class SimpleMutationObserver
   * @classdesc Wrapper over MutationObserver. Provides simple interface
   * for listening event of is inserted or removed selector from node.
   *
   * @constructor
   * @param {Node} node - Node for which observing DOM mutation.
   */
  var SimpleMutationObserver = function(node) {
    var self = this;

    /**
     * Node for which observing DOM mutation.
     *
     * @name SimpleMutationObserver#node
     * @type Node
     */
    self.node = node;

    /**
     * Storage for state of selectors.
     * Where key is the selector, and value is the state.
     *
     * @name SimpleMutationObserver#selectors
     * @type Object
     */
    self.selectors = {};

    /**
     * Storage for event handlers.
     * Where key is the selector, and value is the object of arrays of handlers.
     *
     * @name SimpleMutationObserver#handlers
     * @type HandlerStorage
     */
    self.handlers = {};

    /**
     * DOM mutations observer.
     *
     * @name SimpleMutationObserver#observer
     * @type MutationObserver
     */
    self.observer = new MutationObserver(function() {
      // for each registered selectors checking state and dispatch events if needed
      for (var selector in self.selectors) {
        var oldState = self.isEnabled(selector);
        var newState = self.checkEnabled(selector);
        self.selectors[selector] = newState;

        // if state not changed skip selector processing
        if (oldState == newState) {
          continue;
        }

        self.deferredTrigger(selector, newState ? "inserted" : "removed");
      }
    });

    // observe DOM mutations
    self.observer.observe(self.node, {childList: true, subtree: true, attributes: true});
  };

  /**
   * Call handlers for selector and event type.
   *
   * @memberof SimpleMutationObserver#
   * @method trigger
   * @param {Object} selector - Selector of event handlers.
   * @param {String} eventType - Event type that can be "inserted" or "removed".
   */
  SimpleMutationObserver.prototype.trigger = function(selector, eventType) {
    var self = this;
    if (!eventType || !self.handlers[selector] || !self.handlers[selector][eventType]) {
      return false;
    }
    // if handler return false or throw exeption remove this handler
    var filteredHandlers = self.handlers[selector][eventType].filter(function(handler) {
      var result = false;
      try {
        result = handler();
      } catch (e) {
        result = false;
      }
      return result !== false;
    });
    // update array of handlers
    self.handlers[selector][eventType] = filteredHandlers;
  };

  /**
   * Deferred call handlers for selector and event type.
   *
   * @memberof SimpleMutationObserver#
   * @method deferredTrigger
   * @param {Object} selector - Selector of event handlers.
   * @param {String} eventType - Event type that can be "inserted" or "removed".
   */
  SimpleMutationObserver.prototype.deferredTrigger = function(selector, eventType) {
    var self = this;
    setTimeout(function() {
      self.trigger(selector, eventType);
    }, 0);
  };

  /**
   * Subscribe handler on the event selector.
   *
   * @memberof SimpleMutationObserver#
   * @method on
   * @param {String} selector - Event selector.
   * @param {String} type - Event type.
   * @param {Function} handler - Event handler.
   */
  SimpleMutationObserver.prototype.on = function(selector, type, handler) {
    if (!selector || !type || !handler) {
      return;
    }
    this.handlers[selector] = this.handlers[selector] || {};
    this.handlers[selector][type] = this.handlers[selector][type] || [];
    this.handlers[selector][type].push(handler);
  };

  /**
   * Subscribe handler on the event selector once. After the call handler will be removed.
   *
   * @memberof SimpleMutationObserver#
   * @method once
   * @param {String} selector - Event selector.
   * @param {String} type - Event type.
   * @param {Function} handler - Event handler.
   */
  SimpleMutationObserver.prototype.once = function(selector, type, handler) {
    if (!selector || !type || !handler) {
      return;
    }
    this.on(selector, type, function() {
      handler();
      return false;
    });
  };

  /**
   * Check enabled state of selector in node.
   *
   * @memberof SimpleMutationObserver#
   * @method checkEnabled
   * @param {String} selector - Selector for checking.
   * @return {Boolean} Boolean indicating whether the DOM node contains selector.
   */
  SimpleMutationObserver.prototype.checkEnabled = function(selector) {
    return Boolean(this.node.querySelector(selector));
  };

  /**
   * Add selector for listening change state.
   *
   * @memberof SimpleMutationObserver#
   * @method addSelector
   * @param {String} selector - Selector for adding.
   */
  SimpleMutationObserver.prototype.addSelector = function(selector) {
    if (!Object.prototype.hasOwnProperty.call(this.selectors,selector)) {
      // write current state of selector
      this.selectors[selector] = this.checkEnabled(selector);
    }
  };

  /**
   * Remove selector listening.
   *
   * @memberof SimpleMutationObserver#
   * @method removeSelector
   * @param {String} selector - Selector for removing.
   */
  SimpleMutationObserver.prototype.removeSelector = function(selector) {
    if (Object.prototype.hasOwnProperty.call(this.selectors,selector)) {
      delete this.selectors[selector];
      delete this.handlers[selector];
    }
  };

  /**
   * State of selector in tracking storage.
   * NOTE: After the call, selector to be tracked.
   *
   * @memberof SimpleMutationObserver#
   * @method isEnabled
   * @param {String} selector - Selector for checking.
   * @return {Boolean} Boolean indicating whether the selector is enabled.
   */
  SimpleMutationObserver.prototype.isEnabled = function(selector) {
    this.addSelector(selector);
    return this.selectors[selector];
  };

  module.exports = SimpleMutationObserver;
})();
