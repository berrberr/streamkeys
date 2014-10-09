var path = require("path"),
    fs = require("fs"),
    webdriver = require("selenium-webdriver");

const SKINFO = "STREAMKEYS-INFO: ";
const SKERR = "STREAMKEYS-ERROR: ";
const WAIT_TIMEOUT = 120000;

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
 * @param action [str] name of streamkeys-test action to perform
 * @return [str] the js as a string
 */
exports.eventScript = function(action) {
  return "document.dispatchEvent(new CustomEvent('streamkeys-test', {detail: '" + action + "'}));";
};

/**
 * Parses a log array looking for a streamkeys action or disabled message
 * @return [bool] true if action is found in log messages
 */
var parseLog = exports.parseLog = function(log, action) {
  //console.log(log);
  return log.some(function(entry) {
    var actionFound = (entry.message.indexOf(SKINFO + action) !== -1 || entry.message.indexOf(SKINFO + "disabled") !== -1);
    var errorFound = (entry.message.indexOf(SKERR) !== -1);
    if(actionFound || errorFound) console.log(entry.message);
    return actionFound;
  });
};

/**
 * Waits for the log to contain a given value
 * @param opts.action [str] string to search log for
 * @param opts.count [int] how many times has check has been performed
 * @param opts.promise [promise] promise to resolve on success/fail
 * @return promise
 */
var waitForLog = exports.waitForLog = function(driver, opts) {
  var def = opts.promise || webdriver.promise.defer();
  if(opts.count > 30) return def.fulfill(false);

  console.log("Waiting for log...", opts.count);
  driver.manage().logs().get("browser").then(function(log) {
    if(helpers.parseLog(log, opts.action)) {
      return def.fulfill(true);
    } else {
      driver.sleep(500).then(function() {
        return waitForLog(driver, {promise: def, action: opts.action, count: (opts.count + 1)});
      });
    }
  });
  return def.promise;
};

/**
 * Waits until an element is visible
 * @param selector [obj] webdriver locator object
 * @param timeout [int] optional timeout
 * @return promise
 */
exports.waitForSelector = function(driver, selector, timeout) {
  timeout = timeout || WAIT_TIMEOUT;

  return driver.wait(function() {
    return (driver.isElementPresent(selector));
  }, timeout);
};

/**
 * Waits for an element to be visible and then clicks it
 * @param selector [obj] webdriver locator object
 * @param timeout [int] optional timeout
 * @return promise
 */
exports.waitAndClick = function(driver, selector, timeout) {
  timeout = timeout || WAIT_TIMEOUT;

  driver.wait(function() {
    console.log("Waiting on click...");
    return (driver.isElementPresent(selector));
  }, timeout).then(function() {
    console.log("Waiting for click done");
    return driver.findElement(selector).click();
  });
};

/**
 * Get a site, dismiss alerts and wait for document load
 * @return promise
 */
exports.getAndWait = function(driver, url) {
  var def = webdriver.promise.defer();
  console.log("Override alerts/unloads");
  driver.getWindowHandle().then(function(handle) {
    console.log("Window handle: ", handle);
    console.log("Getting: ", url);
    driver.get(url).then(function() {
      console.log("Got URL, checking alerts");
      alertCheck(driver).then(function() {
        console.log("Alert check complete!");
        waitForLoad(driver)
        .then(function() {
          console.log("Load complete!");
          def.fulfill(null);
        })
        .thenCatch(function(err) {
          def.reject(err);
        });
      });
    });
  });
  return def.promise;
};

/**
 * Attempts to override alerts an unload events on a page
 * @return promise
 */
var overrideAlerts = exports.overrideAlerts = function(driver) {
  return driver.executeScript("window.onunload=null;window.onbeforeunload=null;window.alert=null;window.confirm=null;");
};

/**
 * Accept an alert if visible
 * @return promise
 */
var alertCheck = exports.alertCheck = function(driver) {
  var def = webdriver.promise.defer();
  console.log("Checking for alerts...");
  driver.getAllWindowHandles().then(function(handles) {
    driver.getWindowHandle().then(function(handle) {
      if(handles.indexOf(handle) !== -1) {
        console.log("There is a window open...");
        driver.switchTo().alert().then(function(alert) {
          console.log("Accept alert...");
          alert.accept();
          def.fulfill(null);
        }, function(error) {
          console.log("No alert found, continue...");
          def.fulfill(null);
        });
      } else {
        console.log("No open window found!");
        def.fulfill(null);
      }
    });
  });
  return def.promise;
};

/**
 * Block until document.readyState is complete
 * @return promise
 */
var waitForLoad = exports.waitForLoad = function(driver) {
  return driver.wait(function() {
    console.log("Waiting for pageload...");
    return driver.executeScript("return document.readyState;").then(function(res) {
      return (res === "complete");
    });
  }, WAIT_TIMEOUT);
};
