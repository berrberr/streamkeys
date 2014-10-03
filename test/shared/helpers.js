var path = require("path"),
    fs = require("fs");

const SKINFO = "STREAMKEYS-INFO: ";
const SKERR = "STREAMKEYS-ERROR: ";
const WAIT_TIMEOUT = 30000;

/**
 * Joins two paths based on first path directory name
 * @param base [str] should be __filename called from
 * @param filePath [str] path to second file or directory, relative to base
 * @return [str] joined path
 */
exports.getPath = function(base, filePath) {
  return path.join(path.dirname(base), filePath);
}

/**
 * Create a custom event containing a streamkeys test action
 * @return [str] the js as a string
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
    var actionFound = (entry.message.indexOf(SKINFO + action) > 0 || entry.message.indexOf(SKINFO + "disabled") > 0);
    var errorFound = (entry.message.indexOf(SKERR) > 0);
    if(actionFound || errorFound) console.log(entry.message);
    return actionFound;
  });
};

/**
 * Waits until an element is visible
 * @param driver [webdriver instance]
 * @param selector [obj] webdriver locator object
 * @param timeout [int] optional timeout
 * @return promise
 */
exports.waitForSelector = function(driver, selector, timeout) {
  var timeout = timeout || WAIT_TIMEOUT;

  return driver.wait(function() {
    return (driver.isElementPresent(selector));
  }, timeout);
};

/**
 * Waits for an element to be visible and then clicks it
 * @param driver [webdriver instance]
 * @param selector [obj] webdriver locator object
 * @param timeout [int] optional timeout
 * @return promise
 */
exports.waitAndClick = function(driver, selector, timeout) {
  var timeout = timeout || WAIT_TIMEOUT;

  driver.wait(function() {
    return (driver.isElementPresent(selector));
  }, timeout);
  return driver.findElement(selector).click();
};

/**
 * Get a site, dismiss alerts and wait for document load
 */
exports.getAndWait = function(driver, url) {
  driver.get(url);
  alertCheck(driver);
  return waitForLoad(driver);
};

/**
 * Accept an alert if visible
 */
var alertCheck = exports.alertCheck = function(driver) {
  driver.switchTo().alert().then(function(alert) {
    console.log("Accept alert");
    alert.accept();
  }, function(error) {
    console.log("No alert found, continue...");
  });

  return true;
};

/**
 * Block until document.readyState is complete
 */
var waitForLoad = exports.waitForLoad = function(driver) {
  return driver.wait(function() {
    console.log("Waiting for pageload");
    return driver.executeScript("return document.readyState;").then(function(res) {
      return res === "complete";
    });
  }, 20000);
};
