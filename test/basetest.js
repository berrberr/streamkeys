var sw = require("selenium-webdriver"),
    path = require("path"),
    chrome = require("selenium-webdriver/chrome");

var chromeOptions = new chrome.Options();
var extPath = "--load-extension=" + path.resolve("streamkeys-ext/");
chromeOptions.addArguments([extPath, "--log-level=0"]);
chromeOptions.setLoggingPrefs({browser: "ALL"});

global.expect = require("chai").expect;
global.shared = require("./musicsite.js");
global.helpers = require("./helpers.js");

console.log("we were required", extPath);
/* exports */
module.exports = {
  test: require("selenium-webdriver/testing"),
  getDriver: function() { return chrome.createDriver(chromeOptions); }
}
