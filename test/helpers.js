const SKINFO = "STREAMKEYS-INFO: ";
const SKERR = "STREAMKEYS-ERROR: ";

/**
 * Create a custom event containing a streamkeys test action
 * @return [string] the js as a string
 */
exports.eventScript = function(action) {
  return "document.dispatchEvent(new CustomEvent('streamkeys-test', {detail: '" + action + "'}));";
};

/**
 * Parses a log array looking for a streamkeys action or disabled message
 * @return [bool] true if action is found in log messages
 */
exports.parseLog = function(log, action) {
  return log.some(function(entry) {
    console.log(entry.message);
    return (entry.message.indexOf(SKINFO + action) > 0 || entry.message.indexOf(SKINFO + "disabled") > 0);
  });
};
