(function() {
  "use strict";

  // Comprehensible array operations
  Array.prototype.isInclude = function(needle) {
    return this.indexOf(needle) != -1;
  };

  // Fix NodeList to behave as expected by developer:
  NodeList.prototype.forEach = Array.prototype.forEach;
  NodeList.prototype.some = Array.prototype.some;
  NodeList.prototype.findIndex = Array.prototype.findIndex;

})();
