var base = require("../basetest.js"),
    driver = base.getDriver();

base.test.describe("Edge Player", function() {

  base.test.before(function(done) {
    base.loadSite(driver, "http://player.edge.ca", done);
  });

  base.test.after(function() {
    driver.quit();
  });

  shared.shouldBehaveLikeAMusicSite(driver);

});
