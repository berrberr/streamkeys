var chrome = require("selenium-webdriver/chrome");

/* globals */
global.expect = require("chai").expect;
global.shared = require("./shared/musicsite.js");
global.helpers = require("./shared/helpers.js");
global.test = require("selenium-webdriver/testing");

var chromeOptions = new chrome.Options(),
    extPath = "--load-extension=" + helpers.getPath(__filename, "streamkeys-ext/"),
    proxy = "--proxy-server=http://23.228.160.2:38356";

console.log("Extension load path: " + extPath);

chromeOptions.addArguments([extPath, proxy, "--log-level=0"]);
chromeOptions.setLoggingPrefs({browser: "ALL"});

/* exports */
module.exports = {
  getDriver: function() { return chrome.createDriver(chromeOptions); },
  loadSite: function(driver, url, callback) {
    driver.get(url).then(function() { callback(); } );
  }
}
