var sw = require("selenium-webdriver"),
    path = require("path"),
    chrome = require("selenium-webdriver/chrome"),
    chai = require("chai"),
    chaiWebdriver = require("chai-webdriver");

var chromeOptions = new chrome.Options();
var extPath = "--load-extension=" + path.resolve("test/streamkeys-ext/");
chromeOptions.addArguments([extPath, "--log-level=0"]);
chromeOptions.setLoggingPrefs({browser: "ALL"});

var driver = chrome.createDriver(chromeOptions);
chai.use(chaiWebdriver(driver));

/* exports */
module.exports = {
  expect: chai.expect,
  test: require("selenium-webdriver/testing"),
  driver: driver
}
