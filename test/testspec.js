var sw = require("selenium-webdriver"),
    test = require("selenium-webdriver/testing"),
    chrome = require("selenium-webdriver/chrome"),
    chai = require("chai"),
    chaiWebdriver = require("chai-webdriver"),
    expect = chai.expect;

var chromeOptions = new chrome.Options();
chromeOptions.addArguments(["--load-extension=streamkeys-dev.zip", "--log-level=0"]);
chromeOptions.setLoggingPrefs({browser: "ALL"});
var driver = chrome.createDriver(chromeOptions);
// var driver = new sw.Builder()
//       .withCapabilities(sw.Capabilities.chrome())
//       .build();
chai.use(chaiWebdriver(driver));

test.describe("Grooveshark", function() {
  this.timeout(20000);

  test.before(function() {
    driver.get("http://www.grooveshark.com");
  });

  test.after(function() {
    driver.quit();
  });

  test.it("loads extension", function() {
    driver.sleep(5000);
    var script = "document.dispatchEvent(new CustomEvent('streamkeys-test', {detail: 'playPause'}));"
    driver.executeScript(script);
    driver.executeScript("console.log('SUP BRO');");
    driver.sleep(2000);
    driver.manage().logs().get("browser").then(function(ent) {console.log(ent);});
    //console.log(expect);
  })
})

