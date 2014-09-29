var base = require("../basetest.js"),
    driver = base.getDriver();

base.test.describe("HypeMachine", function() {

  // base.test.before(function(done) {
  //   base.loadSite(driver, "http://www.hypem.com", done);
  // });

  // base.test.after(function() {
  //   driver.quit();
  // });

  shared.shouldBehaveLikeAMusicSite(driver, "http://www.hypem.com");

});
