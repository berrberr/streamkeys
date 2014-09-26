exports.shouldBehaveLikeAMusicSite = function(driver) {

  describe("music site behaviour", function() {

    it("should play", function() {
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        driver.manage().logs().get("browser").then(function(ent) {
          console.log(ent);
          expect(helpers.parseLog(ent)).to.be.true;
        });
      });
    });

    it("should pause", function() {
      driver.executeScript(helpers.eventScript("playPause")).then(function() {
        driver.manage().logs().get("browser").then(function(ent) {
          console.log(ent);
          expect(helpers.parseLog(ent)).to.be.true;
        });
      });
    });

  });

};
