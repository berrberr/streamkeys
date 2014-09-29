var base = require("../basetest.js"),
    driver = base.getDriver();

base.test.describe("Di.fm", function() {

  // base.test.before(function(done) {
  //   base.loadSite(driver, "http://www.di.fm/ambient", done);
  // });

  // base.test.after(function() {
  //   driver.quit();
  // });

  shared.shouldBehaveLikeAMusicSite(driver, "http://www.di.fm/ambient");

});
